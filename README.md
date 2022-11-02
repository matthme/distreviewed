# Distreviewed

Distributed peer-reviews for academic publications built on [Holochain](https://www.holochain.org/).

## Prototype

This is a rudimentary prototype that emerged at a Holochain Hackathon in Berlin.

## Why

The processes around publication of academic research are broken and everyone knows it.

Academic Journals extract value generated by publicly funded institutions merely by capturing and constraining our collective signalling capacities around the relevance and quality of research.

The value of peer-review lies in the time spent by critical eyes to review a paper:

> `N` x `C` x `T`

`N`: Number of eyes that reviewed the paper<br>
`C`: Combined competency of those eyes<br>
`T`: Time spent by those eyes to review the paper<br>

Why should we create artificial, extractive bottlenecks to what gets visibility and what doesn't if we can just create tools that optimize for this value in itself?


## How

Distreviewed is a rudimentry prototype of how peer-review could look like on Holochain. Reviews can be written and discovered for any paper simply by referring to its [doi](https://en.wikipedia.org/wiki/Digital_object_identifier) or another unique identifier.


## Imagine...

Imagine how research could look like if not constrained by extractive Journals in between. Imagine something similar to [Git](https://en.wikipedia.org/wiki/Git) but for research. Academic papers become evolvable entities that make visible the sources of contributions that lead to their current shape, giving us the capacity to leverage collective intelligence and discover valuable contributors not on the basis of the "prestige" of their university or research group but by their mere ability to shape and catalyze the process of discovery.


## Wireframe

![image](https://user-images.githubusercontent.com/36768177/199517990-389a0a93-7f32-40d3-baa6-7647b9a5794a.png)


## Developer

If you want to run or modify the hApp as a developer, make sure you have the holochain development environment set up (https://developer.holochain.org/install/) and clone this respository.

Then, in the root folder of the repository run

```
nix-shell
npm install
```

And to run it:

```
npm run start
```













