import argparse
import os
from collections.abc import Sequence

import pandas as pd


def parse_args(args: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Filter courses")
    parser.add_argument(
        "file",
        type=str,
        nargs="+",
        help="Path to the input table file",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=str,
        default=None,
        help="Path to the output file (default: ./results/table.csv)",
    )
    return parser.parse_args(args)


def normalize_instructor(df: pd.DataFrame) -> None:
    def normalize(name: str) -> str:
        if pd.isna(name):
            return name
        instructors = name.split(",")
        instructors = sorted(set(instructors))
        name = ",".join(instructors)
        return name

    df["Instructor"] = df["Instructor"].apply(normalize)


def sort_and_deduplicate(df: pd.DataFrame) -> pd.DataFrame:
    df = (
        df.sort_values("Term")
        .groupby(["CourseName", "Instructor"], as_index=False)
        .last()
    )
    df = df.sort_values(by=["CourseName", "Instructor"]).reset_index(drop=True)
    return df


def work(input_files: list[str], output_file: str) -> None:
    total_df = pd.DataFrame()
    for input_file in input_files:
        df = pd.read_csv(filepath_or_buffer=input_file)
        mask_major = df["SKBJ"].str.contains(
            "计算机学院计算机科学与技术|计算机学院信息与计算科学", na=False
        )
        mask_kind = ~df["TXKCLB_DISPLAY"].isin(["思政课", "英语课", "军事课"])
        df = df[mask_major & mask_kind]
        converted_df = pd.DataFrame(
            {
                "Term": df["XNXQDM"],
                "CourseId": df["KCH"],
                "CourseName": df["KCM"],
                "CourseKind": df["TXKCLB_DISPLAY"],
                "Instructor": df["SKJS"],
                "Credit": df["XF"],
                "Major": df["SKBJ"],
            }
        )
        total_df = pd.concat([total_df, converted_df], ignore_index=True)

    normalize_instructor(total_df)
    total_df = sort_and_deduplicate(total_df)
    total_df.to_csv(path_or_buf=output_file, index=False)


def main():
    args = parse_args()
    input_files = args.file
    if args.output is None:
        os.makedirs("./results", exist_ok=True)
        output_file = "./results/table.csv"
    else:
        output_file = args.output

    print(f"Input tables: {input_files}")
    print(f"Output file: {output_file}")
    work(input_files, output_file)


if __name__ == "__main__":
    main()
