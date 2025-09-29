# NannaU-CS/course-generator

This repository contains the functionality for fetching course information from the official website, filtering it by major, and generating folders and template files for each course.

## Repository Structure

- [./scripts/fetch.js](./scripts/fetch.js): Script to fetch course data from the official website. It shall run in the browser console of <https://ehallapp.nju.edu.cn/jwapp/sys/kcbcx/*default/index.do>. Modify the `term` variable on top of the script to fetch courses for a specific term. Please put the downloaded `.csv` file under `./tables` folder.
- [./filter.py](./filter.py): Python script to filter courses by major. Use `python filter.py -h` for usage instructions. The filtered results will be saved in `./results/table.csv`. Now this script only filters courses for 计拔, 信计 and 计科.
- [./generate.py](./generate.py): Python script to generate folders and template files for each course based on the filtered results. Use `python generate.py -h` for usage instructions. The generated files will be placed in the `./results/tree` folder, with `./results/tree/nav.yaml` as the navigation file and `./results/tree/courses` as the course folder in the website.

## Environment Setup

We recommend using [uv](https://docs.astral.sh/uv) for environment management. After installing `uv`, run the following commands to set up the environment:

```bash
uv sync
```

and activate the environment with:

```bash
source .venv/bin/activate
```
