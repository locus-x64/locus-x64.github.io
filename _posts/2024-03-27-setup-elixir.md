---
layout: post
title: "Elixir Cross Referencer: Indexing and Auditing Source Code"
tags:
 - Vulnerability Research
 - Code Auditing
author: "Ali Raza"
comments: true
permalink: /posts/setup-elixir
description: "Explore source code in your browser - Particularly useful for the Linux kernel and other low-level projects in C/C++"

---
<!-- Post Image -->
![Elixir](/assets/images/posts/2024-03-27-setup-elixir/setup-elixir-backdrop.jpg)

## Elixir

Elixir is a source code cross-referencer inspired by [LXR](https://en.wikipedia.org/wiki/LXR_Cross_Referencer). It’s written in Python, and its main purpose is to index every release of a C or C++ project (like the Linux kernel) while keeping a minimal footprint.

It uses Git as a source-code file store and Berkeley DB for cross-reference data. Internally, it indexes Git blobs rather than trees of files to avoid duplicating work and data. It has a straightforward data structure (reminiscent of older LXR releases) to keep queries simple and fast.


## Why Elixir?

I have been working on Linux kernel exploitation, and I have been using Elixir by [Bootlin](https://elixir.bootlin.com/) for kernel code cross-referencing. With this type of cross-referencing, I can easily navigate through the codebase and find the definitions of functions, variables, and macros for any version of the kernel. This is particularly useful when you are looking for a specific function or variable and want to see where it is defined and used in the codebase.

After a while, I started working on other userland projects, and for that, I looked into setting up my own instance of Elixir. This way, I can index any project I want and have a similar experience as I have with the Linux kernel. This blog post is a guide on how to set up your own instance of Elixir and index any project you want.

## Setting up Elixir

The original setup for Elixir was a bit involved, but recently the process has been streamlined significantly with official Docker support from the Elixir project itself. Here’s the updated, simpler way to get your own Elixir instance running.

As a prerequisite, you need to have Docker installed on your system.

```bash
docker --version
```

### Step 1: Clone the Elixir Repository

First, we need to get the Elixir source code, which includes the necessary Docker files.

```bash
# Clone the Elixir repository
git clone https://github.com/bootlin/elixir.git ./elixir
cd elixir
```

### Step 2: Build the Docker Image

Now, from within the `elixir` directory, we can build the Docker image. The `ELIXIR_VERSION` build argument is used to tag the image with the current git commit hash.

```bash
# Build the Docker image with version tag
docker build -t elixir --build-arg ELIXIR_VERSION=$(git rev-parse --short HEAD) -f ./docker/Dockerfile .
```

### Step 3: Run the Elixir Container

With the image built, we need to create a directory on our host machine to store the generated index data. This ensures the data persists even if we remove the container. Then, we can run the container.

```bash
# Create a directory for Elixir data
mkdir ./elixir-data

# Run the container with mounted data volume
docker run -v ./elixir-data/:/srv/elixir-data -p 8080:80 -d --name elixir-container elixir
```
This command runs the container in detached mode (`-d`), names it `elixir-container` for easy reference, and maps port 8080 on your local machine to port 80 inside the container.

### Step 4: Index a Project

Now for the fun part! We can tell our running Elixir instance to index a project. We'll use the `zlog` project from the original post as an example.

```bash
# Add your custom repository
docker exec -it elixir-container index /srv/elixir-data zlog https://github.com/HardySimpson/zlog.git
```
This command executes the `index` script inside the `elixir-container`. The arguments are:
1.  `/srv/elixir-data`: The path inside the container where data should be stored.
2.  `zlog`: The name for your project.
3.  `https://github.com/HardySimpson/zlog.git`: The URL of the git repository to index.

The indexing process might take some time depending on the size of the repository.

### Step 5: Access Your Indexed Project

Once indexing is complete, you can access your project's source code in your browser at:
`http://localhost:8080/zlog/latest/source`

You'll have a fully browsable, cross-referenced view of your code!

## Keeping Things Updated

If the source repository is updated with new commits or tags, you can update your Elixir index.

To update a specific project:
```bash
docker exec -it elixir-container index /srv/elixir-data zlog
```

To update all indexed projects:
```bash
docker exec -it elixir-container index /srv/elixir-data --all
```

## A More Persistent Setup with Docker Compose

For a more permanent or production-like setup, using `docker-compose` is a great idea. Create a `docker-compose.yml` file in the `elixir` directory with the following content:

```yaml
version: '3.8'
services:
  elixir:
    build:
      context: .
      dockerfile: docker/Dockerfile
      args:
        ELIXIR_VERSION: latest
    ports:
      - "8080:80"
    volumes:
      - ./elixir-data:/srv/elixir-data
    restart: unless-stopped
```

You can then manage your Elixir instance with `docker-compose up -d` and `docker-compose down`.

## Tags/Version

Each tag in your Git repository will be indexed by Elixir and identified as a version of the project. You can navigate through the different versions of the project.

~ locus_x64
