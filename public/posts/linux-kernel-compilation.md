---
id: "1"
slug: "linux-kernel-compilation"
title: "Linux Kernel Compilation and Adding a Custom System Call"
excerpt: "We can make changes to the Linux kernel and compile it to make a custom copy. Learn how to compile a kernel, add a custom system call, write a wrapper function, and create a man page."
date: "2022-04-13"
readingTime: 15
tags: ["Linux Kernel", "System Calls", "Security Research"]
---

## Prerequisites

Please make sure you have a good amount of free space. As for Virtual Machines, people had issues when they allocated only 20GB of storage space. So, allocate at least 50GB to avoid issues.

Install the following packages before moving to the next step:

```bash
sudo apt install gcc make bc build-essential libelf-dev libssl-dev bison flex initramfs-tools git-core libncurses5-dev dwarves zstd
```

> **Note:** The `dwarves` and `zstd` packages are often missed but are required.

Now you can follow these steps. First, we'll compile the kernel and test that it's running. Then we'll add our custom system call.

## Compiling Linux Kernel

### Step 1: Downloading source code and extracting

Download the kernel file from [www.kernel.org](http://www.kernel.org/) I would recommend downloading Linux Kernel 5.3.7 or a later version because the method of adding system calls described here is for kernel 5.3.7 or above.

For simplicity, you can download from this direct link (`Kernel 5.10.117`):

[https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.10.117.tar.xz](https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.10.117.tar.xz)

if you are looking to download any other version, for simplicity you will need to download the tarball file, as shown in the picture below.

![Kernel Download](images/posts/linux-kernel-compilation/1.jpeg)

When you have downloaded the `linux-5.x.x.tar.xz` archive file, you need to extract it to a directory.

```bash
tar xvf linux-5.x.x.tar.xz
cd linux-5.x.x.tar.xz
```

Now you are in the directory of kernel files, which you can verify by listing the files using the `ls` command.

![Kernel Files](images/posts/linux-kernel-compilation/2.png)

### Step 2: Configuration

Now, you need to configure your flavor of the kernel. Configuring the kernel involves selecting which features you want to build into the kernel image, which features you want to build as loadable modules, and which features you want to omit entirely. The configuration process will create a `.config` script for building the kernel. The `.config` file contains the configuration information for the kernel to be compiled.

There are different methods to configure the Linux kernel, but we'll use the configuration of the currently running kernel. Here, we'll copy the old configuration from `/boot/config-x.x.x-x-generic` and create a new `.config` file in our kernel's directory.

```bash
cp /boot/config-5.13.0-40-generic ./.config
```

> **Tip:** You may have more than one `config-x.x.x-x-generic` file, so to check which configuration is active, use `uname -r` and then copy that version of the generic file.

Now in this .config file, we need to make some changes.

1. Open the .config file in vim.
2. Search for `CONFIG_SYSTEM_TRUSTED_KEYS` and assign an empty string to it (i.e., double quotes `""`)
3. Search for `CONFIG_SYSTEM_REVOCATION_KEYS` and assign an empty string to it (i.e., double quotes `""`)

![Config Changes](images/posts/linux-kernel-compilation/3.jpeg)

4. Now, save the file and quit. `:wq!`

Now run the following command to configure:

```bash
yes '' | make oldconfig
```

You have now completed the configuration. However, you still need to distinguish your kernel from other versions. To do so, open the `Makefile` in the kernel's root directory and change the `EXTRAVERSION` variable to something like this:

![Makefile EXTRAVERSION](images/posts/linux-kernel-compilation/4.png)

Now, to make a copy of the kernel release, run the following command:

```bash
make kernelrelease
```

### Step 3: Compiling the modules

Now it's time to build/compile the kernel modules.

```bash
make -j $(nproc) bzImage

make -j $(nproc) modules
```

### Step 4: Installing modules

Your kernel release has now been compiled. Now, to install the modules:

```bash
sudo make INSTALL_MOD_STRIP=1 modules_install
```

This step will create a new directory, `/lib/modules/5.10.117-arm/`, and copy all the `.ko` files (modules) into it.

### Step 5: Installing kernel

Now, run the following command to install the custom kernel.

```bash
sudo make install
```

The `install` section of the `Makefile` will move the files to their destination locations, which are mentioned in the `DIR` variables.

### Step 6: Updating the grub

Your kernel has now been compiled and installed. However, we still need to update the GRUB bootloader to boot our system from the custom kernel. For that, we need to increase the boot selection time. Open the `/etc/default/grub` file and change the `GRUB_TIMEOUT` value from 5 to 30.

Moreover, leave the `GRUB_DEFAULT` value as 0, which means that, by default, it will boot from the first kernel entry.

After making these changes, update the bootloader:

```bash
sudo update-grub2
```

This will update GRUB with the new kernel. Restart your system to boot from the new kernel.

> **Note:** If you have a Linux OS as your host operating system and you have turned on Secure Boot, you might get an error while booting from your new kernel. To handle that error, you need to turn off Secure Boot and try to boot from your new kernel.

```bash
sudo systemctl reboot
```

## Adding a Custom System Call

We have now compiled and installed our configured Linux kernel release. Now it's time to make actual changes in the kernel source code. We'll add a custom "hello world" system call.

> **Important:** Make sure that you have not booted from your custom kernel to follow these steps.

### Step 1: Writing the systemcall code

Create a C file in which you'll define your system call:

```bash
mkdir my_syscall
cd my_syscall
touch hello_world.c
```

Add the following code snippet as your custom system call code:

![System Call Code](images/posts/linux-kernel-compilation/5.png)

```c
#include <linux/kernel.h>
#include <linux/syscalls.h>

SYSCALL_DEFINE0(hello_world)
{
 printk("Hello Ali. This is me, your custom system call.\n");
 return 0;
}
```

Create a `Makefile` inside your system call's directory and add:

```makefile
obj-y := hello_world.o
```

### Step 2: Adding the header

We need to link this system call with the kernel's `syscalls` header:

```bash
nvim include/linux/syscalls.h
```

Add this line at the end of the file, just above `#endif`:

```c
asmlinkage long sys_hello_world (void);
```

### Step 3: Registering in the syscall table

Now, we need to register our system call in the `syscall` table to get a unique system call number:

```bash
nvim arch/x86/entry/syscalls/syscall_64.tbl
```

Add the following entry at the end of the file:

![Syscall Table](images/posts/linux-kernel-compilation/6.png)

> **Note:** Remember to use a unique system call number. Do not use reserved numbers already mentioned in the table. I used the number 696 for my system call.

```c
696 64 hello_world sys_hello_world
```

### Step 4: Adding to the kernel Makefile

Open the `Makefile` and search for the `core-y` entry. At the end of this line, add the system call's directory:

![Core-y Makefile](images/posts/linux-kernel-compilation/7.png)

```makefile
core-y += kernel/ certs/ mm/ fs/ ipc/ security/ crypto/ block/ my_syscall/
```

### Step 5: Recompile and install

Now recompile and install the kernel:

```bash
make -j $(nproc)
sudo make install
sudo systemctl reboot
```

> **Note:** You'll find a .old kernel file in the GRUB bootloader, but don't boot from it; boot from your custom kernel.

### Step 6: Testing the system call

Now test the changes you've made. You must be booted from your own new kernel release (verify with `uname -r`).

Write a driver program and test your system call:

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>

int main(){
 long rv = syscall(696);
 if(rv == -1){
  printf("error\n");
  return -1;
 }
 return 0;
}
```

Since `printk` writes to the kernel log, use `dmesg | tail` to see the output after running the driver program.

![System Call Working](images/posts/linux-kernel-compilation/8.jpeg)

## Writing a Wrapper Function

We have successfully added and tested our system call. Now, we write a wrapper function so we don't need to remember the syscall number.

### Step 1: Write a wrapper function

Create `greetings.c`:

```c
#include <sys/syscall.h>
#include <stdio.h>
#include <unistd.h>

#define SYSCALLNO 696

int hello(const char* name){
 printf("Hello %s!\nYour message is displayed in the kernel log.\nYou can use dmesg to read it.\n\nThank me later.\n",name);
 long rv = syscall(SYSCALLNO);
 if (rv == -1){
  fprintf(stderr,"Error: Syscall Not found :(\n");
 }
 return rv;
}
```

Create a dynamic library:

```bash
gcc -c -fPIC greetings.c
gcc -shared greetings.o -o libgreetings.so
sudo cp libgreetings.so /usr/lib
```

Write a driver program to test:

```c
#include <stdio.h>
int main(){
 char name[20];
 scanf("%s", &name);
 int rv = hello(name);
 return rv;
}
```

Compile with:

```bash
gcc driver.c -o driver -lgreetings
```

## Writing the Man Page

To complete the system call development, let's write a `man` page. System calls reside in chapter 2, so place the manual in `/usr/share/man/man2`.

The filename should be `greetings.2`:

```
.TH GREETINGS 2 "August 2022" "Linux Programmer's Manual"
.SH NAME
 greetings \- Prints a greeting message to the kernel buffer.
.SH SYNOPSIS
.br
.sp
.BI int ("void");
.SH DESCRIPTION
This system call was written by Ali Raza.
It simply prints a greeting message.
.SH "RETURN VALUE"
Returns 0 on success or -1 on failure.
```

Compress and install:

```bash
gzip greetings.2
sudo cp greetings.gz /usr/share/man/man2/
```

Now try `man greetings` and you'll find your man page.

I hope this was an informative tutorial. Happy Learning!

> Learning Linux is fun with [Dr. Arif Butt](http://www.arifbutt.me/)

— locus-x64