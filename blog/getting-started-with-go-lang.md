---
title: "Getting Started with Go: A Hands-On Introduction"
author: CodeIter
license: CC BY-SA 4.0
excerpt: "Learn the fundamentals of Go programming with clear explanations and practical examples."
keywords:
  - Go
  - Golang
  - programming
  - tutorial
createdAt: "2024-10-27T10:00:00.000Z"
updatedAt: "2024-10-27T10:00:00.000Z"
---

# Why Choose Go?

Go (or Golang) is a statically typed, compiled language created at Google.
It’s designed for simplicity, performance, and concurrency. Go’s clean syntax
and built-in support for parallel execution make it ideal for building web
servers, command-line tools, and network services. In this tutorial, we’ll
cover basic concepts, show you how to compile and run Go code, and explore its
powerful concurrency primitives.

# Installing Go

1. Download the installer from the official site: https://golang.org/dl/
2. Follow the platform-specific instructions.
3. Verify your installation:
   ```bash
   go version
   ```
   You should see output like `go version go1.20.3 linux/amd64`.

# Hello, World!

Create a file called `hello.go`:
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```
Compile and run:
```bash
go run hello.go
```

# Variables and Types

Go has strong typing. Here’s how to declare variables:
```go
package main

import "fmt"

func main() {
    var name string = "Alice"
    age := 30        // shorthand syntax
    pi := 3.14159

    fmt.Println("Name:", name)
    fmt.Println("Age:", age)
    fmt.Printf("Pi: %.2f\n", pi)
}
```

# Functions

Define reusable functions:
```go
package main

import "fmt"

func add(a int, b int) int {
    return a + b
}

func main() {
    sum := add(5, 7)
    fmt.Println("5 + 7 =", sum)
}
```

# Concurrency with Goroutines and Channels

Go makes concurrency easy:
```go
package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, j)
        time.Sleep(time.Millisecond * 500)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 5)
    results := make(chan int, 5)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    for a := 1; a <= 5; a++ {
        fmt.Println("Result:", <-results)
    }
}
```
- We launch three worker goroutines.
- Jobs are sent over a channel and results collected on another.

# Next Steps

- Explore Go modules (`go mod init`, `go get`).
- Read the official Effective Go guide: https://golang.org/doc/effective_go
- Build small projects: a CLI tool, a web server with `net/http`, or a REST API.

Happy coding with Go!
