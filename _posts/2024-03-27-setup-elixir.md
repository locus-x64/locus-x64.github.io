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

Elixir is a source code cross-referencer inspired by [LXR](https://en.wikipedia.org/wiki/LXR_Cross_Referencer). It’s written in Python and its main purpose is to index every release of a C or C++ project (like the Linux kernel) while keeping a minimal footprint.

It uses Git as a source-code file store and Berkeley DB for cross-reference data. Internally, it indexes Git blobs rather than trees of files to avoid duplicating work and data. It has a straightforward data structure (reminiscent of older LXR releases) to keep queries simple and fast.


## Why Elixir?

I have been working on linux kernel exploitation and I have been using Elixir by [Bootlin](https://elixir.bootlin.com/) for kernel code cross-referencing. With this type of cross-referencing, I can easily navigate through the codebase and find the definitions of functions, variables, and macros of any version of the kernel. This is particularly useful when you are looking for a specific function or variable and you want to see where it is defined and used in the codebase.

After a while, I started working on other userland projects and for that I looked into setting up my own instance of Elixir. This way I can index any project I want and have a similar experience as I have with the Linux kernel. This blog post is a guide on how to set up your own instance of Elixir and index any project you want.

## Setting up Elixir

Elixir's instance ran in a Docker container and it was pretty easy to set up. Here is a step-by-step guide on how to set up your own instance of Elixir. In this example is used [zlog](https://github.com/HardySimpson/zlog) as my target project for cross-refrencing. As a pre requisite, you need to have Docker installed on your system.

```bash
docker --version
```
Create a directory for your Elixir instance and inside that directory create a `Dockerfile` with the following content:

```Dockerfile
FROM debian:bookworm AS build

RUN \
  apt-get update && \
  apt-get --no-install-recommends -y install \
    python3 \
    python3-pip \
    python3-dev \
    libdb-dev \
    build-essential

WORKDIR /build/

# NOTE wheel version MUST be sycnhronized with requirements.txt
RUN pip wheel berkeleydb==18.1.10

FROM debian:bookworm

RUN \
  apt-get update && \
  apt-get --no-install-recommends -y install \
    python3 \
    python3-pip \
    python3-venv \
    universal-ctags \
    libdb5.3 \
    perl \
    git \
    apache2 \
    libapache2-mod-wsgi-py3 \
    libjansson4 \
    libyaml-0-2 \
    wget

COPY . /usr/local/elixir/

WORKDIR /usr/local/elixir/

COPY --from=build /build/berkeleydb-*.whl /tmp/build/

RUN python3 -m venv venv && \
    . ./venv/bin/activate && \
    pip install /tmp/build/berkeleydb-*.whl && \
    pip install -r requirements.txt

RUN mkdir -p /srv/elixir-data/

COPY ./docker/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite

EXPOSE 80

ARG ELIXIR_VERSION
ENV ELIXIR_VERSION=$ELIXIR_VERSION

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
```

Create a directory tree as `./docker/debian/` (assuming you are using debian) and inside that directory create a file named `000-default.conf` with the following content:

```apache
<Directory /usr/local/elixir/>
    AllowOverride None
    Require all denied
    <FilesMatch "wsgi.py">
        Require all granted
    </FilesMatch>
</Directory>
<Directory /usr/local/elixir/static/>
    AllowOverride None
    Require all granted
</Directory>
<VirtualHost *:80>
    ServerName MY_LOCAL_IP
    DocumentRoot /usr/local/elixir/

    SetEnv LXR_PROJ_DIR /srv/elixir-data/
    # NOTE: it's recommended to set processes value to the number of available cores
    WSGIDaemonProcess Elixir processes=4 display-name=%{GROUP} home=/usr/local/elixir/ python-home=/usr/local/elixir/venv/

    WSGIProcessGroup Elixir
    WSGIScriptAliasMatch "^/(?!static/)" /usr/local/elixir/wsgi.py/$1

    AllowEncodedSlashes On
    RewriteEngine on
    RewriteRule "^/$" "/linux/latest/source" [R]
</VirtualHost>
```

Now build the docker image with the following command:

```bash
sudo docker build -t elixir.zlog --build-arg GIT_REPO_URL=https://github.com/HardySimpson/zlog --build-arg PROJECT=zlog .
```

Here it is important to note that the `GIT_REPO_URL` and `PROJECT` are the arguments that you need to pass to the docker build command. The `GIT_REPO_URL` is the URL of the git repository that you want to index and the `PROJECT` is the name of the project that you want to index. ```elixir.zlog``` is the name of the docker image that you are building.

It may take some time to build the image. Once the image is built, you can run the docker container with the following command:

```bash
sudo docker run elixir.zlog
```

Now you can visit _http://172.17.0.2/zlog/latest/source_ in your browser and you will see the Elixir instance running with the zlog project indexed. You can navigate through the codebase and see the definitions of functions, variables, and macros.

## Tags/Version

Each tag in your git repository will be indexed by Elixir and is identified as a version of the project. You can navigate through the different versions of the project.

~ Ali Raza Mumtaz (arm)
