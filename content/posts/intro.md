---
title: Intro to Python
description: stuff
date: 2025-05-28
tags:
  - programming
  - workshops
---

Python is a full programming language that's easy to get started with, but is incredibly powerful and used for ALL KINDS of real world things -- science experiments, running the government, powering your favourite web applications, and more. See <https://www.python.org>

Many of the things you already know from Scratch have a direct equivalent in Python! For example, you already know what a loop is -- now you're just going to type something instead of dragging a block in.

## Installing

First, Python needs to be installed on your computer. It is by default on MacOS; for Windows see <https://www.python.org/downloads/windows/>

After that, we'll need a Terminal program to access Python. On Mac this is Terminal.app.

## Running programs

You can enter a program directly in a Python "shell" and run it from there, like this:

```shell
$ python3
Python 3.9.6 (default, Mar 12 2025, 20:22:46)
[Clang 17.0.0 (clang-1700.0.13.3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Note the ">>>" is waiting for you to type something. It will respond when you hit enter, and then let you keep going:

```shell
>>> print("Hello!")
Hello!
>>>
```

Most times it's more convenient to type your Python program in a file, and then run it, like this:

```shell
$ python3 my-program.py
```

That file is really just a text file, but it's helpful to (a) name it ending .py; and (b) create it in a _code editor_ instead of eg TextEdit.

## Important to know

### Syntax

Colons `:` are required at the end of statements that start a block (eg `if`, `while`, `def`). (See above example)

Use `=` to assign a value to a variable:

```python
name = "Dieter"
```

Use `==` to compare things:

```python
name == "Dieter" # True
```

It's a common source of bugs to mix these up! See also `!=`, `>`, `>=`, etc.

### Code blocks

Different programming languages have different ways of saying "this is a section of code". Some use brackets like `{}` or keywords like `start/end` surrounding the section.

Python uses _whitespace_ or _indentation_ to do this. That makes it easy to type and read, but it also means you have to be consistent or else your program might not work properly. Usually the indentation is 4 spaces.

```python
if name == "Dieter":
    print("Cool name, bro") # this line is part of the `if` section, so must be indented
```

### Data types

Data types (more on what this is later) are built-in to Python.

- _Boolean_ is for `True` and `False`
- _Strings_ are for text: `"hello"`
- _Numbers_ are either `int` for integer (`3`) or `float` if decimals (`3.5`)
- _Lists_ are for, uh, lists. This is a list of strings: `["a", "b", "c"]`
- _Dictionaries_ are for key/value pairs: `{ "name": "Sally", "age": 16 }`

### Case sensitive

Python is _case-sensitive_, which means `Name` and `name` are different values, and `True` is not the same as `true`.

## Errors

The other important thing to know is: _Errors are normal! They happen all the time! NBD!_ If something goes wrong:

- Read the error message; it will often tell you exactly what's happening
- Check your indentation, colons, variable names
- Ask for help -- that's also part of the process, literally everyone does

Try this:

```python
if True:
print("a")
```

Or this:

```python
if True:
    print("a")
        print("b")
```

Or this:

```python
if True
    print("a")
```
