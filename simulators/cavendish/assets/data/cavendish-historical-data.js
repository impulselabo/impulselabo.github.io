/* CV079A02 historical layer; CV080A12 source re-audit corrections applied without changing layer identity. */
window.CAVENDISH_HISTORICAL_DATA_V1 = Object.freeze({
  "schema_version": "1.2.0",
  "build": "CV079A02",
  "title": "Cavendish 1798 historical experiment numeric transcription",
  "source": {
    "author": "Henry Cavendish",
    "title": "Experiments to Determine the Density of the Earth",
    "journal": "Philosophical Transactions of the Royal Society of London",
    "volume": "88",
    "year": "1798",
    "pages": "469–526",
    "doi": "10.1098/rstl.1798.0022",
    "transcription_basis": "visual transcription from original paper page images; decimal commas and printed fractions preserved; OCR used only for navigation",
    "coverage": {
      "apparatus_and_method_pages": "469–479",
      "experiment_tables_pages": "480–508",
      "computation_pages": "509–519",
      "conclusion_pages": "520–522",
      "appendix_case_pages": "523–526"
    }
  },
  "columns": [
    "experiment_id",
    "date_label",
    "mass_position_label",
    "extreme_points",
    "divisions",
    "time_hms",
    "point_of_rest",
    "time_of_mid_vibration",
    "difference",
    "thermometer_air",
    "thermometer_weight",
    "observation_note"
  ],
  "experiments": [
    {
      "id": "experiment-i",
      "experiment_number": 1,
      "roman": "I",
      "label": "Experiment I",
      "data_key": "CAV-1798-EXP-I",
      "heading_original": "EXPERIMENT I. Aug. 5.",
      "date_original": "Aug. 5",
      "date_iso": "1797-08-05",
      "date_label": "1797-08-05（原表表記: Aug. 5）",
      "source_pages": [
        480
      ],
      "sections": [
        {
          "label": "Weights in midway position",
          "mass_position": "midway",
          "rows": [
            {
              "divisions": "11,4",
              "time_hms": "9:42:00",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-001",
              "raw_text": "div 11,4 | time 9:42:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "11,5",
              "time_hms": "9:55:00",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-002",
              "raw_text": "div 11,5 | time 9:55:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "11,5",
              "time_hms": "10:05:00",
              "point_of_rest": "11,5",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-003",
              "raw_text": "div 11,5 | time 10:05:00 | rest 11,5",
              "section_label": "Weights in midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            480
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "23,4",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-004",
              "raw_text": "extreme 23,4",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,6",
              "point_of_rest": "25,82",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-005",
              "raw_text": "extreme 27,6 | rest 25,82",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "24,7",
              "point_of_rest": "26,07",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-006",
              "raw_text": "extreme 24,7 | rest 26,07",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,3",
              "point_of_rest": "26,1",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-007",
              "raw_text": "extreme 27,3 | rest 26,1",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,1",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-008",
              "raw_text": "extreme 25,1",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "event": "At 10h 5′, weights moved to positive position.",
          "source_pages": [
            480
          ]
        },
        {
          "label": "Weights returned back to midway position",
          "mass_position": "midway",
          "rows": [
            {
              "extreme_point": "5",
              "time_of_mid_vibration": "0:01:13",
              "division_crossings": [
                {
                  "division": "11",
                  "time_hms": "0:00:48"
                },
                {
                  "division": "12",
                  "time_hms": "0:01:30"
                }
              ],
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-009",
              "raw_text": "extreme 5 | div 11 @ 0:00:48 | div 12 @ 0:01:30 | mid 0:01:13",
              "section_label": "Weights returned back to midway position"
            },
            {
              "extreme_point": "18,2",
              "point_of_rest": "12",
              "time_of_mid_vibration": "0:16:09",
              "difference": "14:56",
              "division_crossings": [
                {
                  "division": "12",
                  "time_hms": "0:16:29"
                },
                {
                  "division": "11",
                  "time_hms": "0:17:20"
                }
              ],
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-010",
              "raw_text": "extreme 18,2 | rest 12 | div 12 @ 0:16:29 | div 11 @ 0:17:20 | mid 0:16:09 | diff 14:56",
              "section_label": "Weights returned back to midway position"
            },
            {
              "extreme_point": "6,6",
              "point_of_rest": "11,92",
              "time_of_mid_vibration": "0:30:45",
              "difference": "14:36",
              "division_crossings": [
                {
                  "division": "11",
                  "time_hms": "0:30:24"
                },
                {
                  "division": "12",
                  "time_hms": "0:31:11"
                }
              ],
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-011",
              "raw_text": "extreme 6,6 | rest 11,92 | div 11 @ 0:30:24 | div 12 @ 0:31:11 | mid 0:30:45 | diff 14:36",
              "section_label": "Weights returned back to midway position"
            },
            {
              "extreme_point": "16,3",
              "point_of_rest": "11,72",
              "time_of_mid_vibration": "0:45:58",
              "difference": "15:13",
              "division_crossings": [
                {
                  "division": "12",
                  "time_hms": "0:45:58"
                },
                {
                  "division": "11",
                  "time_hms": "0:47:04"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-012",
              "raw_text": "extreme 16,3 | rest 11,72 | div 12 @ 0:45:58 | div 11 @ 0:47:04 | mid 0:45:58 | diff 15:13 | mid-vibration time preserved as printed",
              "section_label": "Weights returned back to midway position"
            },
            {
              "extreme_point": "7,7",
              "source_page": 480,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-I-ROW-013",
              "raw_text": "extreme 7,7",
              "section_label": "Weights returned back to midway position"
            }
          ],
          "source_type": "historical",
          "event": "At 11h 6′, weights returned back to midway position.",
          "source_pages": [
            480
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "midway_to_positive",
            "value": "14,32",
            "unit": "divisions"
          },
          {
            "transition": "positive_to_midway",
            "value": "14,1",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "midway",
            "value": "14′55″"
          }
        ]
      },
      "notes": [
        "The first extreme after motion was not observed; source narrative explains the damping procedure."
      ],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 13
    },
    {
      "id": "experiment-ii",
      "experiment_number": 2,
      "roman": "II",
      "label": "Experiment II",
      "data_key": "CAV-1798-EXP-II",
      "heading_original": "EXPERIMENT II. Aug. 6.",
      "date_original": "Aug. 6",
      "date_iso": "1797-08-06",
      "date_label": "1797-08-06（原表表記: Aug. 6）",
      "source_pages": [
        482,
        483
      ],
      "sections": [
        {
          "label": "Weights in midway position",
          "mass_position": "midway",
          "rows": [
            {
              "divisions": "11",
              "time_hms": "10:04:00",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-001",
              "raw_text": "div 11 | time 10:04:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "11",
              "time_hms": "10:11:00",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-002",
              "raw_text": "div 11 | time 10:11:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "11",
              "time_hms": "10:17:00",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-003",
              "raw_text": "div 11 | time 10:17:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "11",
              "time_hms": "10:25:00",
              "point_of_rest": "11",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-004",
              "raw_text": "div 11 | time 10:25:00 | rest 11",
              "section_label": "Weights in midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            482
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "29,3",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-005",
              "raw_text": "extreme 29,3",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "24,1",
              "point_of_rest": "26,87",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-006",
              "raw_text": "extreme 24,1 | rest 26,87",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "30",
              "point_of_rest": "27,57",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-007",
              "raw_text": "extreme 30 | rest 27,57",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,2",
              "point_of_rest": "28,02",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-008",
              "raw_text": "extreme 26,2 | rest 28,02",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "29,7",
              "point_of_rest": "28,12",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-009",
              "raw_text": "extreme 29,7 | rest 28,12",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,9",
              "point_of_rest": "28,05",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-010",
              "raw_text": "extreme 26,9 | rest 28,05",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,7",
              "point_of_rest": "27,85",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-011",
              "raw_text": "extreme 28,7 | rest 27,85",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,1",
              "point_of_rest": "27,82",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-012",
              "raw_text": "extreme 27,1 | rest 27,82",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,4",
              "source_page": 482,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-013",
              "raw_text": "extreme 28,4",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            482
          ]
        },
        {
          "label": "Weights returned to midway position",
          "mass_position": "midway",
          "rows": [
            {
              "extreme_point": "6",
              "time_of_mid_vibration": "1:04:01",
              "division_crossings": [
                {
                  "division": "12",
                  "time_hms": "1:03:50"
                },
                {
                  "division": "13",
                  "time_hms": "1:04:34"
                }
              ],
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-014",
              "raw_text": "extreme 6 | div 12 @ 1:03:50 | div 13 @ 1:04:34 | mid 1:04:01",
              "section_label": "Weights returned to midway position"
            },
            {
              "extreme_point": "18,5",
              "point_of_rest": "12,37",
              "time_of_mid_vibration": "1:18:53",
              "difference": "14:52",
              "division_crossings": [
                {
                  "division": "13",
                  "time_hms": "1:18:29"
                },
                {
                  "division": "12",
                  "time_hms": "1:19:18"
                }
              ],
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-015",
              "raw_text": "extreme 18,5 | rest 12,37 | div 13 @ 1:18:29 | div 12 @ 1:19:18 | mid 1:18:53 | diff 14:52",
              "section_label": "Weights returned to midway position"
            },
            {
              "extreme_point": "6,5",
              "point_of_rest": "11,67",
              "time_of_mid_vibration": "1:33:39",
              "difference": "14:46",
              "division_crossings": [
                {
                  "division": "11",
                  "time_hms": "1:33:48"
                },
                {
                  "division": "12",
                  "time_hms": "1:34:51"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-016",
              "raw_text": "extreme 6,5 | rest 11,67 | div 11 @ 1:33:48 | div 12 @ 1:34:51 | mid 1:33:39 | diff 14:46 | mid-vibration time preserved as printed",
              "section_label": "Weights returned to midway position"
            },
            {
              "extreme_point": "15,2",
              "point_of_rest": "11",
              "time_of_mid_vibration": "1:47:25",
              "difference": "13:46",
              "division_crossings": [
                {
                  "division": "13",
                  "time_hms": "1:45:08"
                },
                {
                  "division": "12",
                  "time_hms": "1:46:22"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-017",
              "raw_text": "extreme 15,2 | rest 11 | div 13 @ 1:45:08 | div 12 @ 1:46:22 | mid 1:47:25 | diff 13:46 | mid-vibration time preserved as printed",
              "section_label": "Weights returned to midway position"
            },
            {
              "extreme_point": "7,1",
              "point_of_rest": "10,75",
              "time_of_mid_vibration": "2:02:50",
              "difference": "15:25",
              "division_crossings": [
                {
                  "division": "11",
                  "time_hms": "2:03:48"
                },
                {
                  "division": "12",
                  "time_hms": "2:05:18"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-018",
              "raw_text": "extreme 7,1 | rest 10,75 | div 11 @ 2:03:48 | div 12 @ 2:05:18 | mid 2:02:50 | diff 15:25 | mid-vibration time preserved as printed",
              "section_label": "Weights returned to midway position"
            },
            {
              "extreme_point": "13,6",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-II-ROW-019",
              "raw_text": "extreme 13,6",
              "section_label": "Weights returned to midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            483
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "midway_to_positive",
            "value": "15,87",
            "unit": "divisions"
          },
          {
            "transition": "positive_to_midway",
            "value": "15,45",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "midway",
            "value": "14′42″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 19
    },
    {
      "id": "experiment-iii",
      "experiment_number": 3,
      "roman": "III",
      "label": "Experiment III",
      "data_key": "CAV-1798-EXP-III",
      "heading_original": "EXPERIMENT III. Aug. 7.",
      "date_original": "Aug. 7",
      "date_iso": "1797-08-07",
      "date_label": "1797-08-07（原表表記: Aug. 7）",
      "source_pages": [
        483,
        484
      ],
      "sections": [
        {
          "label": "Weights in positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "31,5",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-001",
              "raw_text": "extreme 31,5",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "29",
              "point_of_rest": "30,12",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-002",
              "raw_text": "extreme 29 | rest 30,12",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "31",
              "point_of_rest": "30,02",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-003",
              "raw_text": "extreme 31 | rest 30,02",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "29,1",
              "source_page": 483,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-004",
              "raw_text": "extreme 29,1",
              "section_label": "Weights in positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            483
          ],
          "note": "The arm was a little in motion before the change."
        },
        {
          "label": "Weights moved to midway position",
          "mass_position": "midway",
          "rows": [
            {
              "extreme_point": "9",
              "time_of_mid_vibration": "10:34:55",
              "division_crossings": [
                {
                  "division": "14",
                  "time_hms": "10:34:18"
                },
                {
                  "division": "15",
                  "time_hms": "10:35:08"
                }
              ],
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-005",
              "raw_text": "extreme 9 | div 14 @ 10:34:18 | div 15 @ 10:35:08 | mid 10:34:55",
              "section_label": "Weights moved to midway position"
            },
            {
              "extreme_point": "20,5",
              "point_of_rest": "14,8",
              "time_of_mid_vibration": "10:49:39",
              "difference": "14:44",
              "division_crossings": [
                {
                  "division": "15",
                  "time_hms": "10:49:31"
                },
                {
                  "division": "14",
                  "time_hms": "10:50:27"
                }
              ],
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-006",
              "raw_text": "extreme 20,5 | rest 14,8 | div 15 @ 10:49:31 | div 14 @ 10:50:27 | mid 10:49:39 | diff 14:44",
              "section_label": "Weights moved to midway position"
            },
            {
              "extreme_point": "9,2",
              "point_of_rest": "14,07",
              "time_of_mid_vibration": "11:04:17",
              "difference": "14:38",
              "division_crossings": [
                {
                  "division": "14",
                  "time_hms": "11:05:07"
                },
                {
                  "division": "15",
                  "time_hms": "11:06:18"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-007",
              "raw_text": "extreme 9,2 | rest 14,07 | div 14 @ 11:05:07 | div 15 @ 11:06:18 | mid 11:04:17 | diff 14:38 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to midway position"
            },
            {
              "extreme_point": "17,4",
              "point_of_rest": "13,52",
              "time_of_mid_vibration": "11:19:04",
              "difference": "14:47",
              "division_crossings": [
                {
                  "division": "14",
                  "time_hms": "11:18:46"
                },
                {
                  "division": "13",
                  "time_hms": "11:19:58"
                }
              ],
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-008",
              "raw_text": "extreme 17,4 | rest 13,52 | div 14 @ 11:18:46 | div 13 @ 11:19:58 | mid 11:19:04 | diff 14:47",
              "section_label": "Weights moved to midway position"
            },
            {
              "extreme_point": "10,1",
              "point_of_rest": "13,8",
              "time_of_mid_vibration": "11:33:31",
              "difference": "14:27",
              "division_crossings": [
                {
                  "division": "13",
                  "time_hms": "11:33:46"
                },
                {
                  "division": "14",
                  "time_hms": "11:35:26"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-009",
              "raw_text": "extreme 10,1 | rest 13,8 | div 13 @ 11:33:46 | div 14 @ 11:35:26 | mid 11:33:31 | diff 14:27 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to midway position"
            },
            {
              "extreme_point": "15,6",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-010",
              "raw_text": "extreme 15,6",
              "section_label": "Weights moved to midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            484
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "32",
              "time_of_mid_vibration": "0:02:59",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "0:02:48"
                },
                {
                  "division": "27",
                  "time_hms": "0:03:56"
                }
              ],
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-011",
              "raw_text": "extreme 32 | div 28 @ 0:02:48 | div 27 @ 0:03:56 | mid 0:02:59",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "23,7",
              "point_of_rest": "27,8",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-012",
              "raw_text": "extreme 23,7 | rest 27,8",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "31,8",
              "point_of_rest": "28,27",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-013",
              "raw_text": "extreme 31,8 | rest 28,27",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,8",
              "point_of_rest": "28,62",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-014",
              "raw_text": "extreme 25,8 | rest 28,62",
              "section_label": "Weights moved to positive position"
            },
            {
              "time_of_mid_vibration": "0:47:40",
              "division_crossings": [
                {
                  "division": "27",
                  "time_hms": "0:44:58"
                },
                {
                  "division": "28",
                  "time_hms": "0:46:50"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-015",
              "raw_text": "div 27 @ 0:44:58 | div 28 @ 0:46:50 | mid 0:47:40 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "31,1",
              "source_page": 484,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-III-ROW-016",
              "raw_text": "extreme 31,1",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            484
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "positive_to_midway",
            "value": "15,22",
            "unit": "divisions"
          },
          {
            "transition": "midway_to_positive",
            "value": "14,5",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "midway",
            "value": "14′39″"
          },
          {
            "position": "positive",
            "value": "14′54″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 16,
      "table_source_pages": [
        483,
        484
      ],
      "narrative_source_pages": [
        485
      ],
      "source_page_note_ja": "原表行 p.483–484／関連叙述 p.485"
    },
    {
      "id": "experiment-iv",
      "experiment_number": 4,
      "roman": "IV",
      "label": "Experiment IV",
      "data_key": "CAV-1798-EXP-IV",
      "heading_original": "EXPERIMENT IV. Aug. 12.",
      "date_original": "Aug. 12",
      "date_iso": "1797-08-12",
      "date_label": "1797-08-12（原表表記: Aug. 12）",
      "source_pages": [
        486,
        487
      ],
      "sections": [
        {
          "label": "Weights in midway position",
          "mass_position": "midway",
          "rows": [
            {
              "divisions": "21,6",
              "time_hms": "9:30:00",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-001",
              "raw_text": "div 21,6 | time 9:30:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "21,5",
              "time_hms": "9:52:00",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-002",
              "raw_text": "div 21,5 | time 9:52:00",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "21,5",
              "time_hms": "10:13:00",
              "point_of_rest": "21,5",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-003",
              "raw_text": "div 21,5 | time 10:13:00 | rest 21,5",
              "section_label": "Weights in midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            486
          ]
        },
        {
          "label": "Weights moved from midway to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "27,2",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-004",
              "raw_text": "extreme 27,2",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "22,1",
              "point_of_rest": "24,6",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-005",
              "raw_text": "extreme 22,1 | rest 24,6",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "27",
              "point_of_rest": "24,67",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-006",
              "raw_text": "extreme 27 | rest 24,67",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "22,6",
              "point_of_rest": "24,75",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-007",
              "raw_text": "extreme 22,6 | rest 24,75",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "26,8",
              "point_of_rest": "24,8",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-008",
              "raw_text": "extreme 26,8 | rest 24,8",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "23,0",
              "point_of_rest": "24,85",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-009",
              "raw_text": "extreme 23,0 | rest 24,85",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "26,6",
              "point_of_rest": "24,9",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-010",
              "raw_text": "extreme 26,6 | rest 24,9",
              "section_label": "Weights moved from midway to positive position"
            },
            {
              "extreme_point": "23,4",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-011",
              "raw_text": "extreme 23,4",
              "section_label": "Weights moved from midway to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            486
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "15",
              "time_of_mid_vibration": "10:20:31",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "10:19:25"
                },
                {
                  "division": "19",
                  "time_hms": "10:20:41"
                }
              ],
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-012",
              "raw_text": "extreme 15 | div 17 @ 10:19:25 | div 19 @ 10:20:41 | mid 10:20:31",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "22,4",
              "point_of_rest": "18,72",
              "time_of_mid_vibration": "10:27:31",
              "difference": "7:00",
              "division_crossings": [
                {
                  "division": "20",
                  "time_hms": "10:26:45"
                },
                {
                  "division": "19",
                  "time_hms": "10:27:22"
                }
              ],
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-013",
              "raw_text": "extreme 22,4 | rest 18,72 | div 20 @ 10:26:45 | div 19 @ 10:27:22 | mid 10:27:31 | diff 7:00",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "15,1",
              "point_of_rest": "18,52",
              "time_of_mid_vibration": "10:34:28",
              "difference": "6:57",
              "division_crossings": [
                {
                  "division": "19",
                  "time_hms": "10:35:01"
                },
                {
                  "division": "20",
                  "time_hms": "10:35:48"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-014",
              "raw_text": "extreme 15,1 | rest 18,52 | div 19 @ 10:35:01 | div 20 @ 10:35:48 | mid 10:34:28 | diff 6:57 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,5",
              "point_of_rest": "18,35",
              "time_of_mid_vibration": "10:41:51",
              "difference": "7:23",
              "division_crossings": [
                {
                  "division": "20",
                  "time_hms": "10:40:23"
                },
                {
                  "division": "19",
                  "time_hms": "10:41:18"
                }
              ],
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-015",
              "raw_text": "extreme 21,5 | rest 18,35 | div 20 @ 10:40:23 | div 19 @ 10:41:18 | mid 10:41:51 | diff 7:23",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "15,3",
              "point_of_rest": "18,22",
              "time_of_mid_vibration": "10:48:39",
              "difference": "6:48",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "10:48:36"
                },
                {
                  "division": "19",
                  "time_hms": "10:49:24"
                }
              ],
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-016",
              "raw_text": "extreme 15,3 | rest 18,22 | div 18 @ 10:48:36 | div 19 @ 10:49:24 | mid 10:48:39 | diff 6:48",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,8",
              "point_of_rest": "18,1",
              "time_of_mid_vibration": "10:55:37",
              "difference": "6:58",
              "division_crossings": [
                {
                  "division": "19",
                  "time_hms": "10:54:45"
                },
                {
                  "division": "18",
                  "time_hms": "10:55:45"
                }
              ],
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-017",
              "raw_text": "extreme 20,8 | rest 18,1 | div 19 @ 10:54:45 | div 18 @ 10:55:45 | mid 10:55:37 | diff 6:58",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "15,5",
              "source_page": 486,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-018",
              "raw_text": "extreme 15,5",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            486
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "31,3",
              "time_of_mid_vibration": "11:10:40",
              "division_crossings": [
                {
                  "division": "25",
                  "time_hms": "11:10:25"
                },
                {
                  "division": "23",
                  "time_hms": "11:11:03"
                }
              ],
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-019",
              "raw_text": "extreme 31,3 | div 25 @ 11:10:25 | div 23 @ 11:11:03 | mid 11:10:40",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "17,1",
              "point_of_rest": "24,02",
              "time_of_mid_vibration": "11:17:43",
              "difference": "7:03",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "11:17:06"
                },
                {
                  "division": "23",
                  "time_hms": "11:17:26"
                }
              ],
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-020",
              "raw_text": "extreme 17,1 | rest 24,02 | div 22 @ 11:17:06 | div 23 @ 11:17:26 | mid 11:17:43 | diff 7:03",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "30,6",
              "point_of_rest": "24,17",
              "time_of_mid_vibration": "11:24:44",
              "difference": "7:01",
              "division_crossings": [
                {
                  "division": "25",
                  "time_hms": "11:24:33"
                },
                {
                  "division": "23",
                  "time_hms": "11:25:17"
                }
              ],
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-021",
              "raw_text": "extreme 30,6 | rest 24,17 | div 25 @ 11:24:33 | div 23 @ 11:25:17 | mid 11:24:44 | diff 7:01",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,4",
              "point_of_rest": "24,32",
              "time_of_mid_vibration": "11:31:49",
              "difference": "7:05",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "11:31:21"
                },
                {
                  "division": "25",
                  "time_hms": "11:32:09"
                }
              ],
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-022",
              "raw_text": "extreme 18,4 | rest 24,32 | div 23 @ 11:31:21 | div 25 @ 11:32:09 | mid 11:31:49 | diff 7:05",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "29,9",
              "point_of_rest": "24,4",
              "time_of_mid_vibration": "11:38:48",
              "difference": "6:59",
              "division_crossings": [
                {
                  "division": "25",
                  "time_hms": "11:38:39"
                },
                {
                  "division": "23",
                  "time_hms": "11:39:31"
                }
              ],
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-023",
              "raw_text": "extreme 29,9 | rest 24,4 | div 25 @ 11:38:39 | div 23 @ 11:39:31 | mid 11:38:48 | diff 6:59",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,4",
              "point_of_rest": "24,5",
              "time_of_mid_vibration": "11:45:54",
              "difference": "7:06",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "11:45:16"
                },
                {
                  "division": "25",
                  "time_hms": "11:46:12"
                }
              ],
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-024",
              "raw_text": "extreme 19,4 | rest 24,5 | div 23 @ 11:45:16 | div 25 @ 11:46:12 | mid 11:45:54 | diff 7:06",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "29,3",
              "source_page": 487,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IV-ROW-025",
              "raw_text": "extreme 29,3",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            487
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "midway_to_positive",
            "value": "3,1",
            "unit": "divisions"
          },
          {
            "transition": "positive_to_negative",
            "value": "6,18",
            "unit": "divisions"
          },
          {
            "transition": "negative_to_positive",
            "value": "5,92",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "negative",
            "value": "7′1″"
          },
          {
            "position": "positive",
            "value": "7′3″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 25
    },
    {
      "id": "experiment-v",
      "experiment_number": 5,
      "roman": "V",
      "label": "Experiment V",
      "data_key": "CAV-1798-EXP-V",
      "heading_original": "EXPERIMENT V. Aug. 20.",
      "date_original": "Aug. 20",
      "date_iso": "1797-08-20",
      "date_label": "1797-08-20（原表表記: Aug. 20）",
      "source_pages": [
        488,
        489
      ],
      "sections": [
        {
          "label": "Weights in positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "29,6",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-001",
              "raw_text": "extreme 29,6",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "21,1",
              "point_of_rest": "25,2",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-002",
              "raw_text": "extreme 21,1 | rest 25,2",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "29",
              "point_of_rest": "25,17",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-003",
              "raw_text": "extreme 29 | rest 25,17",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "21,6",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-004",
              "raw_text": "extreme 21,6",
              "section_label": "Weights in positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            488
          ],
          "note": "The arm was made to vibrate by moving the index."
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "22,6",
              "time_of_mid_vibration": "10:23:11",
              "division_crossings": [
                {
                  "division": "20",
                  "time_hms": "10:22:47"
                },
                {
                  "division": "19",
                  "time_hms": "10:23:30"
                }
              ],
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-005",
              "raw_text": "extreme 22,6 | div 20 @ 10:22:47 | div 19 @ 10:23:30 | mid 10:23:11",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "16,3",
              "point_of_rest": "19,27",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-006",
              "raw_text": "extreme 16,3 | rest 19,27",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,9",
              "point_of_rest": "19,15",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-007",
              "raw_text": "extreme 21,9 | rest 19,15",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "16,5",
              "point_of_rest": "19,1",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-008",
              "raw_text": "extreme 16,5 | rest 19,1",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,5",
              "point_of_rest": "19,07",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-009",
              "raw_text": "extreme 21,5 | rest 19,07",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "16,8",
              "point_of_rest": "19,07",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-010",
              "raw_text": "extreme 16,8 | rest 19,07",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,2",
              "point_of_rest": "19,07",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-011",
              "raw_text": "extreme 21,2 | rest 19,07",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,1",
              "point_of_rest": "19,05",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-012",
              "raw_text": "extreme 17,1 | rest 19,05",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,8",
              "point_of_rest": "19,02",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-013",
              "raw_text": "extreme 20,8 | rest 19,02",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,4",
              "point_of_rest": "19,05",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-014",
              "raw_text": "extreme 17,4 | rest 19,05",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,6",
              "point_of_rest": "19,02",
              "time_of_mid_vibration": "11:33:53",
              "division_crossings": [
                {
                  "division": "20",
                  "time_hms": "11:32:16"
                },
                {
                  "division": "19",
                  "time_hms": "11:33:58"
                }
              ],
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-015",
              "raw_text": "extreme 20,6 | rest 19,02 | div 20 @ 11:32:16 | div 19 @ 11:33:58 | mid 11:33:53",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,5",
              "point_of_rest": "18,97",
              "time_of_mid_vibration": "11:41:06",
              "difference": "7:13",
              "division_crossings": [
                {
                  "division": "19",
                  "time_hms": "11:41:16"
                },
                {
                  "division": "20",
                  "time_hms": "11:43:00"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-016",
              "raw_text": "extreme 17,5 | rest 18,97 | div 19 @ 11:41:16 | div 20 @ 11:43:00 | mid 11:41:06 | diff 7:13 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,3",
              "source_page": 488,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-017",
              "raw_text": "extreme 20,3",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            488
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "20,2",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-018",
              "raw_text": "extreme 20,2",
              "section_label": "Weights moved to positive position"
            },
            {
              "time_of_mid_vibration": "11:49:37",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:49:10"
                },
                {
                  "division": "26",
                  "time_hms": "11:50:19"
                }
              ],
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-019",
              "raw_text": "div 24 @ 11:49:10 | div 26 @ 11:50:19 | mid 11:49:37",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "29,4",
              "point_of_rest": "24,95",
              "time_of_mid_vibration": "11:56:44",
              "difference": "7:07",
              "division_crossings": [
                {
                  "division": "26",
                  "time_hms": "11:56:15"
                },
                {
                  "division": "25",
                  "time_hms": "11:56:47"
                }
              ],
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-020",
              "raw_text": "extreme 29,4 | rest 24,95 | div 26 @ 11:56:15 | div 25 @ 11:56:47 | mid 11:56:44 | diff 7:07",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "20,8",
              "point_of_rest": "24,92",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-021",
              "raw_text": "extreme 20,8 | rest 24,92",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,7",
              "point_of_rest": "24,87",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-022",
              "raw_text": "extreme 28,7 | rest 24,87",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "21,3",
              "point_of_rest": "24,85",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-023",
              "raw_text": "extreme 21,3 | rest 24,85",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,1",
              "point_of_rest": "24,75",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-024",
              "raw_text": "extreme 28,1 | rest 24,75",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "21,5",
              "point_of_rest": "24,67",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-025",
              "raw_text": "extreme 21,5 | rest 24,67",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,6",
              "point_of_rest": "24,67",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-026",
              "raw_text": "extreme 27,6 | rest 24,67",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "22",
              "point_of_rest": "24,7",
              "time_of_mid_vibration": "0:46:21",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "0:45:48"
                },
                {
                  "division": "25",
                  "time_hms": "0:46:43"
                }
              ],
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-027",
              "raw_text": "extreme 22 | rest 24,7 | div 24 @ 0:45:48 | div 25 @ 0:46:43 | mid 0:46:21",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,2",
              "point_of_rest": "24,7",
              "time_of_mid_vibration": "0:53:22",
              "difference": "7:01",
              "division_crossings": [
                {
                  "division": "25",
                  "time_hms": "0:53:11"
                },
                {
                  "division": "24",
                  "time_hms": "0:54:09"
                }
              ],
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-028",
              "raw_text": "extreme 27,2 | rest 24,7 | div 25 @ 0:53:11 | div 24 @ 0:54:09 | mid 0:53:22 | diff 7:01",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "22,4",
              "source_page": 489,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-V-ROW-029",
              "raw_text": "extreme 22,4",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            489
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "positive_to_negative",
            "value": "5,9",
            "unit": "divisions"
          },
          {
            "transition": "negative_to_positive",
            "value": "5,98",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "negative",
            "value": "7′5″"
          },
          {
            "position": "positive",
            "value": "7′5″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 29
    },
    {
      "id": "experiment-vi",
      "experiment_number": 6,
      "roman": "VI",
      "label": "Experiment VI",
      "data_key": "CAV-1798-EXP-VI",
      "heading_original": "EXPERIMENT VI. Sept. 6.",
      "date_original": "Sept. 6",
      "date_iso": "1797-09-06",
      "date_label": "1797-09-06（原表表記: Sept. 6）",
      "source_pages": [
        493
      ],
      "sections": [
        {
          "label": "Weights in midway position",
          "mass_position": "midway",
          "rows": [
            {
              "divisions": "18,9",
              "time_hms": "9:43",
              "thermometer_air": "55,5°",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-001",
              "raw_text": "div 18,9 | time 9:43 | air 55,5°",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "18,85",
              "time_hms": "10:03",
              "point_of_rest": "18,85",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-002",
              "raw_text": "div 18,85 | time 10:03 | rest 18,85",
              "section_label": "Weights in midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            493
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "13,1",
              "time_hms": "10:12",
              "thermometer_air": "55,5°",
              "thermometer_weight": "55,8°",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-003",
              "raw_text": "extreme 13,1 | time 10:12 | air 55,5° | weight 55,8°",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "18,4",
              "time_hms": "10:18",
              "point_of_rest": "15,82",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-004",
              "raw_text": "extreme 18,4 | time 10:18 | rest 15,82",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,4",
              "time_hms": "10:25",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-005",
              "raw_text": "extreme 13,4 | time 10:25",
              "section_label": "Weights moved to negative position"
            },
            {
              "observation_note": "missed.",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-006",
              "raw_text": "missed.",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,6",
              "time_hms": "10:39",
              "thermometer_air": "55,5°",
              "thermometer_weight": "55,8°",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-007",
              "raw_text": "extreme 13,6 | time 10:39 | air 55,5° | weight 55,8°",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,6",
              "time_hms": "10:46",
              "point_of_rest": "15,65",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-008",
              "raw_text": "extreme 17,6 | time 10:46 | rest 15,65",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,8",
              "time_hms": "10:53",
              "point_of_rest": "15,65",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-009",
              "raw_text": "extreme 13,8 | time 10:53 | rest 15,65",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,4",
              "time_hms": "11:00",
              "point_of_rest": "15,65",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-010",
              "raw_text": "extreme 17,4 | time 11:00 | rest 15,65",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,0",
              "time_hms": "11:07",
              "point_of_rest": "15,65",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-011",
              "raw_text": "extreme 14,0 | time 11:07 | rest 15,65",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,2",
              "time_hms": "11:14",
              "thermometer_air": "55,5°",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-012",
              "raw_text": "extreme 17,2 | time 11:14 | air 55,5°",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            493
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "25,8",
              "time_hms": "11:23",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-013",
              "raw_text": "extreme 25,8 | time 11:23",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "17,5",
              "time_hms": "11:30",
              "point_of_rest": "21,55",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-014",
              "raw_text": "extreme 17,5 | time 11:30 | rest 21,55",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,4",
              "time_hms": "11:37",
              "point_of_rest": "21,6",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-015",
              "raw_text": "extreme 25,4 | time 11:37 | rest 21,6",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,1",
              "time_hms": "11:44",
              "point_of_rest": "21,65",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-016",
              "raw_text": "extreme 18,1 | time 11:44 | rest 21,65",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,0",
              "time_hms": "11:51",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-017",
              "raw_text": "extreme 25,0 | time 11:51",
              "section_label": "Weights moved to positive position"
            },
            {
              "observation_note": "missed.",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-018",
              "raw_text": "missed.",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "24,7",
              "time_hms": "0:05",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-019",
              "raw_text": "extreme 24,7 | time 0:05",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19",
              "time_hms": "0:12",
              "point_of_rest": "21,77",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-020",
              "raw_text": "extreme 19 | time 0:12 | rest 21,77",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "24,4",
              "time_hms": "0:19",
              "source_page": 493,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VI-ROW-021",
              "raw_text": "extreme 24,4 | time 0:19",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            493
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "midway_to_negative",
            "value": "3,03",
            "unit": "divisions"
          },
          {
            "transition": "negative_to_positive",
            "value": "5,9",
            "unit": "divisions"
          }
        ],
        "vibration_periods": []
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 21
    },
    {
      "id": "experiment-vii",
      "experiment_number": 7,
      "roman": "VII",
      "label": "Experiment VII",
      "data_key": "CAV-1798-EXP-VII",
      "heading_original": "EXPERIMENT VII. Sept. 18.",
      "date_original": "Sept. 18",
      "date_iso": "1797-09-18",
      "date_label": "1797-09-18（原表表記: Sept. 18）",
      "source_pages": [
        494
      ],
      "sections": [
        {
          "label": "Weights in midway position",
          "mass_position": "midway",
          "rows": [
            {
              "divisions": "19,4",
              "time_hms": "8:30",
              "thermometer_air": "56,7°",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-001",
              "raw_text": "div 19,4 | time 8:30 | air 56,7°",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "19,4",
              "time_hms": "9:32",
              "thermometer_air": "56,6°",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-002",
              "raw_text": "div 19,4 | time 9:32 | air 56,6°",
              "section_label": "Weights in midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            494
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "13,6",
              "time_hms": "9:40",
              "thermometer_weight": "57,2°",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-003",
              "raw_text": "extreme 13,6 | time 9:40 | weight 57,2°",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "18,8",
              "time_hms": "9:47",
              "point_of_rest": "16,25",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-004",
              "raw_text": "extreme 18,8 | time 9:47 | rest 16,25",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,8",
              "time_hms": "9:54",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-005",
              "raw_text": "extreme 13,8 | time 9:54",
              "section_label": "Weights moved to negative position"
            },
            {
              "observation_note": "Eight extreme points missed.",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-006",
              "raw_text": "Eight extreme points missed.",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "16,9",
              "time_hms": "10:58",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-007",
              "raw_text": "extreme 16,9 | time 10:58",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,5",
              "time_hms": "11:05",
              "point_of_rest": "15,62",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-008",
              "raw_text": "extreme 14,5 | time 11:05 | rest 15,62",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "16,6",
              "time_hms": "11:12",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-009",
              "raw_text": "extreme 16,6 | time 11:12",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            494
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "26,4",
              "time_hms": "11:20",
              "thermometer_air": "56,5°",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-010",
              "raw_text": "extreme 26,4 | time 11:20 | air 56,5°",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "17,2",
              "time_hms": "11:28",
              "point_of_rest": "21,72",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-011",
              "raw_text": "extreme 17,2 | time 11:28 | rest 21,72",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,1",
              "time_hms": "11:35",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-012",
              "raw_text": "extreme 26,1 | time 11:35",
              "section_label": "Weights moved to positive position"
            },
            {
              "observation_note": "Four extreme points missed.",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-013",
              "raw_text": "Four extreme points missed.",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,3",
              "time_hms": "0:10",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-014",
              "raw_text": "extreme 19,3 | time 0:10",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,1",
              "time_hms": "0:17",
              "point_of_rest": "22,3",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-015",
              "raw_text": "extreme 25,1 | time 0:17 | rest 22,3",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,7",
              "time_hms": "0:24",
              "source_page": 494,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VII-ROW-016",
              "raw_text": "extreme 19,7 | time 0:24",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            494
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "midway_to_negative",
            "value": "3,15",
            "unit": "divisions"
          },
          {
            "transition": "negative_to_positive",
            "value": "6,1",
            "unit": "divisions"
          }
        ],
        "vibration_periods": []
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 16
    },
    {
      "id": "experiment-viii",
      "experiment_number": 8,
      "roman": "VIII",
      "label": "Experiment VIII",
      "data_key": "CAV-1798-EXP-VIII",
      "heading_original": "EXPERIMENT VIII. Sept. 23.",
      "date_original": "Sept. 23",
      "date_iso": "1797-09-23",
      "date_label": "1797-09-23（原表表記: Sept. 23）",
      "source_pages": [
        495
      ],
      "sections": [
        {
          "label": "Weights in midway position",
          "mass_position": "midway",
          "rows": [
            {
              "divisions": "19,3",
              "time_hms": "9:46",
              "thermometer_air": "53,1°",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-001",
              "raw_text": "div 19,3 | time 9:46 | air 53,1°",
              "section_label": "Weights in midway position"
            },
            {
              "divisions": "19,2",
              "time_hms": "10:45",
              "point_of_rest": "19,2",
              "thermometer_air": "53,1°",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-002",
              "raw_text": "div 19,2 | time 10:45 | rest 19,2 | air 53,1°",
              "section_label": "Weights in midway position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            495
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "13,5",
              "time_hms": "10:56",
              "thermometer_weight": "53,6°",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-003",
              "raw_text": "extreme 13,5 | time 10:56 | weight 53,6°",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "18,6",
              "time_hms": "11:03",
              "point_of_rest": "16,07",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-004",
              "raw_text": "extreme 18,6 | time 11:03 | rest 16,07",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,6",
              "time_hms": "11:10",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-005",
              "raw_text": "extreme 13,6 | time 11:10",
              "section_label": "Weights moved to negative position"
            },
            {
              "observation_note": "Four extreme points missed.",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-006",
              "raw_text": "Four extreme points missed.",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,4",
              "time_hms": "11:44",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-007",
              "raw_text": "extreme 17,4 | time 11:44",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,1",
              "time_hms": "11:51",
              "point_of_rest": "15,7",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-008",
              "raw_text": "extreme 14,1 | time 11:51 | rest 15,7",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "17,2",
              "time_hms": "11:58",
              "thermometer_weight": "53,6°",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-009",
              "raw_text": "extreme 17,2 | time 11:58 | weight 53,6°",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            495
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "15,7",
              "time_hms": "0:01",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-010",
              "raw_text": "extreme 15,7 | time 0:01",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,7",
              "time_hms": "0:08",
              "point_of_rest": "21,42",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-011",
              "raw_text": "extreme 26,7 | time 0:08 | rest 21,42",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "16,6",
              "time_hms": "0:15",
              "thermometer_air": "53,15°",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-012",
              "raw_text": "extreme 16,6 | time 0:15 | air 53,15°",
              "section_label": "Weights moved to positive position"
            },
            {
              "observation_note": "Two extreme points missed.",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-013",
              "raw_text": "Two extreme points missed.",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,9",
              "time_hms": "0:36",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-014",
              "raw_text": "extreme 25,9 | time 0:36",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,1",
              "time_hms": "0:43",
              "point_of_rest": "21,9",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-015",
              "raw_text": "extreme 18,1 | time 0:43 | rest 21,9",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,5",
              "time_hms": "0:50",
              "source_page": 495,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-VIII-ROW-016",
              "raw_text": "extreme 25,5 | time 0:50",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            495
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "midway_to_negative",
            "value": "3,13",
            "unit": "divisions"
          },
          {
            "transition": "negative_to_positive",
            "value": "5,72",
            "unit": "divisions"
          }
        ],
        "vibration_periods": []
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 16
    },
    {
      "id": "experiment-ix",
      "experiment_number": 9,
      "roman": "IX",
      "label": "Experiment IX",
      "data_key": "CAV-1798-EXP-IX",
      "heading_original": "EXPERIMENT IX. April 29.",
      "date_original": "April 29",
      "date_iso": "1798-04-29",
      "date_label": "1798-04-29（原表表記: April 29）",
      "source_pages": [
        497,
        498
      ],
      "sections": [
        {
          "label": "Weights in positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "34,7",
              "source_page": 497,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-001",
              "raw_text": "extreme 34,7",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "35",
              "point_of_rest": "34,84",
              "source_page": 497,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-002",
              "raw_text": "extreme 35 | rest 34,84",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "34,65",
              "source_page": 497,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-003",
              "raw_text": "extreme 34,65",
              "section_label": "Weights in positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            497
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "23,8",
              "time_of_mid_vibration": "11:18:43",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "11:18:29"
                },
                {
                  "division": "29",
                  "time_hms": "11:18:58"
                }
              ],
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-004",
              "raw_text": "extreme 23,8 | div 28 @ 11:18:29 | div 29 @ 11:18:58 | mid 11:18:43",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "33,2",
              "point_of_rest": "28,52",
              "time_of_mid_vibration": "11:25:40",
              "division_crossings": [
                {
                  "division": "29",
                  "time_hms": "11:25:27"
                },
                {
                  "division": "28",
                  "time_hms": "11:25:57"
                }
              ],
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-005",
              "raw_text": "extreme 33,2 | rest 28,52 | div 29 @ 11:25:27 | div 28 @ 11:25:57 | mid 11:25:40",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "23,9",
              "point_of_rest": "28,25",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-006",
              "raw_text": "extreme 23,9 | rest 28,25",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "32",
              "point_of_rest": "28,01",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-007",
              "raw_text": "extreme 32 | rest 28,01",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "24,15",
              "point_of_rest": "27,82",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-008",
              "raw_text": "extreme 24,15 | rest 27,82",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "31",
              "point_of_rest": "27,63",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-009",
              "raw_text": "extreme 31 | rest 27,63",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "24,4",
              "point_of_rest": "27,55",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-010",
              "raw_text": "extreme 24,4 | rest 27,55",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "30,4",
              "point_of_rest": "27,47",
              "time_of_mid_vibration": "0:07:26",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "0:07:04"
                },
                {
                  "division": "27",
                  "time_hms": "0:07:53"
                }
              ],
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-011",
              "raw_text": "extreme 30,4 | rest 27,47 | div 28 @ 0:07:04 | div 27 @ 0:07:53 | mid 0:07:26",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "24,7",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-IX-ROW-012",
              "raw_text": "extreme 24,7",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            498
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "positive_to_negative",
            "value": "6,32",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "negative",
            "value": "6′58″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 12
    },
    {
      "id": "experiment-x",
      "experiment_number": 10,
      "roman": "X",
      "label": "Experiment X",
      "data_key": "CAV-1798-EXP-X",
      "heading_original": "EXPERIMENT X. May 5.",
      "date_original": "May 5",
      "date_iso": "1798-05-05",
      "date_label": "1798-05-05（原表表記: May 5）",
      "source_pages": [
        498,
        499
      ],
      "sections": [
        {
          "label": "Weights in positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "34,5",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-001",
              "raw_text": "extreme 34,5",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "33,5",
              "point_of_rest": "33,97",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-002",
              "raw_text": "extreme 33,5 | rest 33,97",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "34,4",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-003",
              "raw_text": "extreme 34,4",
              "section_label": "Weights in positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            498
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "22,3",
              "time_of_mid_vibration": "10:43:36",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "10:43:42"
                },
                {
                  "division": "29",
                  "time_hms": "10:44:06"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-004",
              "raw_text": "extreme 22,3 | div 28 @ 10:43:42 | div 29 @ 10:44:06 | mid 10:43:36 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "33,2",
              "point_of_rest": "27,82",
              "time_of_mid_vibration": "10:50:36",
              "difference": "7:00",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "10:50:33"
                },
                {
                  "division": "27",
                  "time_hms": "10:51:00"
                }
              ],
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-005",
              "raw_text": "extreme 33,2 | rest 27,82 | div 28 @ 10:50:33 | div 27 @ 10:51:00 | mid 10:50:36 | diff 7:00",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "22,6",
              "point_of_rest": "27,72",
              "source_page": 498,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-006",
              "raw_text": "extreme 22,6 | rest 27,72",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "32,5",
              "point_of_rest": "27,7",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-007",
              "raw_text": "extreme 32,5 | rest 27,7",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "23,2",
              "point_of_rest": "27,58",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-008",
              "raw_text": "extreme 23,2 | rest 27,58",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "31,45",
              "point_of_rest": "27,4",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-009",
              "raw_text": "extreme 31,45 | rest 27,4",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "23,5",
              "point_of_rest": "27,28",
              "time_of_mid_vibration": "11:25:24",
              "division_crossings": [
                {
                  "division": "27",
                  "time_hms": "11:25:20"
                },
                {
                  "division": "28",
                  "time_hms": "11:25:58"
                }
              ],
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-010",
              "raw_text": "extreme 23,5 | rest 27,28 | div 27 @ 11:25:20 | div 28 @ 11:25:58 | mid 11:25:24",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "30,7",
              "point_of_rest": "27,21",
              "time_of_mid_vibration": "11:32:27",
              "difference": "7:03",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "11:32:00"
                },
                {
                  "division": "27",
                  "time_hms": "11:32:40"
                }
              ],
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-011",
              "raw_text": "extreme 30,7 | rest 27,21 | div 28 @ 11:32:00 | div 27 @ 11:32:40 | mid 11:32:27 | diff 7:03",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "23,95",
              "point_of_rest": "27,21",
              "time_of_mid_vibration": "11:39:23",
              "difference": "6:56",
              "division_crossings": [
                {
                  "division": "27",
                  "time_hms": "11:39:19"
                },
                {
                  "division": "28",
                  "time_hms": "11:40:02"
                }
              ],
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-012",
              "raw_text": "extreme 23,95 | rest 27,21 | div 27 @ 11:39:19 | div 28 @ 11:40:02 | mid 11:39:23 | diff 6:56",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "30,25",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-X-ROW-013",
              "raw_text": "extreme 30,25",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            498,
            499
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "positive_to_negative",
            "value": "6,15",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "negative",
            "value": "6′59″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 13
    },
    {
      "id": "experiment-xi",
      "experiment_number": 11,
      "roman": "XI",
      "label": "Experiment XI",
      "data_key": "CAV-1798-EXP-XI",
      "heading_original": "EXPERIMENT XI. May 6.",
      "date_original": "May 6",
      "date_iso": "1798-05-06",
      "date_label": "1798-05-06（原表表記: May 6）",
      "source_pages": [
        499,
        500
      ],
      "sections": [
        {
          "label": "Weights in positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "34,9",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-001",
              "raw_text": "extreme 34,9",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "34,1",
              "point_of_rest": "34,47",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-002",
              "raw_text": "extreme 34,1 | rest 34,47",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "34,8",
              "point_of_rest": "34,49",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-003",
              "raw_text": "extreme 34,8 | rest 34,49",
              "section_label": "Weights in positive position"
            },
            {
              "extreme_point": "34,25",
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-004",
              "raw_text": "extreme 34,25",
              "section_label": "Weights in positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            499
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "23,3",
              "time_of_mid_vibration": "10:00:08",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "9:59:59"
                },
                {
                  "division": "29",
                  "time_hms": "10:00:27"
                }
              ],
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-005",
              "raw_text": "extreme 23,3 | div 28 @ 9:59:59 | div 29 @ 10:00:27 | mid 10:00:08",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "33,3",
              "point_of_rest": "28,42",
              "difference": "7:05",
              "division_crossings": [
                {
                  "division": "29",
                  "time_hms": "10:06:52"
                },
                {
                  "division": "27",
                  "time_hms": "10:07:51"
                }
              ],
              "source_page": 499,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-006",
              "raw_text": "extreme 33,3 | rest 28,42 | div 29 @ 10:06:52 | div 27 @ 10:07:51 | diff 7:05",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "23,8",
              "point_of_rest": "28,35",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-007",
              "raw_text": "extreme 23,8 | rest 28,35",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "32,5",
              "point_of_rest": "28,3",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-008",
              "raw_text": "extreme 32,5 | rest 28,3",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "24,4",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-009",
              "raw_text": "extreme 24,4",
              "section_label": "Weights moved to negative position"
            },
            {
              "observation_note": "missed.",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-010",
              "raw_text": "missed.",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "24,8",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-011",
              "raw_text": "extreme 24,8",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "31,3",
              "point_of_rest": "28,17",
              "time_of_mid_vibration": "10:49:08",
              "division_crossings": [
                {
                  "division": "29",
                  "time_hms": "10:48:37"
                },
                {
                  "division": "28",
                  "time_hms": "10:49:21"
                }
              ],
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-012",
              "raw_text": "extreme 31,3 | rest 28,17 | div 29 @ 10:48:37 | div 28 @ 10:49:21 | mid 10:49:08",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "25,3",
              "point_of_rest": "28,2",
              "time_of_mid_vibration": "10:56:13",
              "division_crossings": [
                {
                  "division": "28",
                  "time_hms": "10:56:08"
                },
                {
                  "division": "29",
                  "time_hms": "10:56:56"
                }
              ],
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-013",
              "raw_text": "extreme 25,3 | rest 28,2 | div 28 @ 10:56:08 | div 29 @ 10:56:56 | mid 10:56:13",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "30,9",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XI-ROW-014",
              "raw_text": "extreme 30,9",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            499,
            500
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "positive_to_negative",
            "value": "6,07",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "negative",
            "value": "7′1″"
          }
        ]
      },
      "notes": [
        "The printed 9:59:59 and 10:00:27 crossings are stored without inferred fractional seconds."
      ],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 14
    },
    {
      "id": "experiment-xii",
      "experiment_number": 12,
      "roman": "XII",
      "label": "Experiment XII",
      "data_key": "CAV-1798-EXP-XII",
      "heading_original": "EXPERIMENT XII. May 9.",
      "date_original": "May 9",
      "date_iso": "1798-05-09",
      "date_label": "1798-05-09（原表表記: May 9）",
      "source_pages": [
        500,
        501
      ],
      "sections": [
        {
          "label": "Weights in negative position",
          "mass_position": "negative",
          "rows": [
            {
              "divisions": "17,4",
              "time_hms": "9:45:00",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-001",
              "raw_text": "div 17,4 | time 9:45:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,4",
              "time_hms": "9:58:00",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-002",
              "raw_text": "div 17,4 | time 9:58:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,4",
              "time_hms": "10:08:00",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-003",
              "raw_text": "div 17,4 | time 10:08:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,4",
              "time_hms": "10:10:00",
              "point_of_rest": "17,4",
              "source_page": 500,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-004",
              "raw_text": "div 17,4 | time 10:10:00 | rest 17,4",
              "section_label": "Weights in negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            500
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "28,85",
              "time_of_mid_vibration": "10:20:59",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "10:20:50"
                },
                {
                  "division": "22",
                  "time_hms": "10:21:46"
                }
              ],
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-005",
              "raw_text": "extreme 28,85 | div 24 @ 10:20:50 | div 22 @ 10:21:46 | mid 10:20:59",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,4",
              "point_of_rest": "23,49",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-006",
              "raw_text": "extreme 18,4 | rest 23,49",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,2",
              "point_of_rest": "23,57",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-007",
              "raw_text": "extreme 28,2 | rest 23,57",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,3",
              "point_of_rest": "23,67",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-008",
              "raw_text": "extreme 19,3 | rest 23,67",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,8",
              "point_of_rest": "23,72",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-009",
              "raw_text": "extreme 27,8 | rest 23,72",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "20",
              "point_of_rest": "23,8",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-010",
              "raw_text": "extreme 20 | rest 23,8",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,4",
              "point_of_rest": "23,83",
              "time_of_mid_vibration": "11:03:14",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:03:13"
                },
                {
                  "division": "23",
                  "time_hms": "11:03:54"
                }
              ],
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-011",
              "raw_text": "extreme 27,4 | rest 23,83 | div 24 @ 11:03:13 | div 23 @ 11:03:54 | mid 11:03:14",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "20,55",
              "point_of_rest": "23,87",
              "time_of_mid_vibration": "11:10:18",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "11:09:45"
                },
                {
                  "division": "24",
                  "time_hms": "11:10:28"
                }
              ],
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-012",
              "raw_text": "extreme 20,55 | rest 23,87 | div 23 @ 11:09:45 | div 24 @ 11:10:28 | mid 11:10:18",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XII-ROW-013",
              "raw_text": "extreme 27",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            501
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "negative_to_positive",
            "value": "6,09",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "positive",
            "value": "7′3″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 13
    },
    {
      "id": "experiment-xiii",
      "experiment_number": 13,
      "roman": "XIII",
      "label": "Experiment XIII",
      "data_key": "CAV-1798-EXP-XIII",
      "heading_original": "EXPERIMENT XIII. May 25.",
      "date_original": "May 25",
      "date_iso": "1798-05-25",
      "date_label": "1798-05-25（原表表記: May 25）",
      "source_pages": [
        501,
        502
      ],
      "sections": [
        {
          "label": "Weights in negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "16",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-001",
              "raw_text": "extreme 16",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "18,3",
              "point_of_rest": "17,2",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-002",
              "raw_text": "extreme 18,3 | rest 17,2",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "16,2",
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-003",
              "raw_text": "extreme 16,2",
              "section_label": "Weights in negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            501
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "29,6",
              "time_of_mid_vibration": "10:22:56",
              "division_crossings": [
                {
                  "division": "25",
                  "time_hms": "10:22:22"
                },
                {
                  "division": "24",
                  "time_hms": "10:22:45"
                }
              ],
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-004",
              "raw_text": "extreme 29,6 | div 25 @ 10:22:22 | div 24 @ 10:22:45 | mid 10:22:56",
              "section_label": "Weights moved to positive position",
              "observation_note": "CV080A12 source re-audit: repeated hour/minute in the second crossing is 10:22:45, not 10:23:45."
            },
            {
              "extreme_point": "17,4",
              "point_of_rest": "23,32",
              "time_of_mid_vibration": "10:30:03",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "10:29:59"
                },
                {
                  "division": "24",
                  "time_hms": "10:30:23"
                }
              ],
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-005",
              "raw_text": "extreme 17,4 | rest 23,32 | div 23 @ 10:29:59 | div 24 @ 10:30:23 | mid 10:30:03",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,9",
              "point_of_rest": "23,4",
              "time_of_mid_vibration": "10:37:07",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "10:36:58"
                },
                {
                  "division": "23",
                  "time_hms": "10:37:24"
                }
              ],
              "source_page": 501,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-006",
              "raw_text": "extreme 28,9 | rest 23,4 | div 24 @ 10:36:58 | div 23 @ 10:37:24 | mid 10:37:07",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,4",
              "point_of_rest": "23,52",
              "time_of_mid_vibration": "10:44:14",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "10:44:03"
                },
                {
                  "division": "24",
                  "time_hms": "10:44:31"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-007",
              "raw_text": "extreme 18,4 | rest 23,52 | div 23 @ 10:44:03 | div 24 @ 10:44:31 | mid 10:44:14",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "28,4",
              "point_of_rest": "23,62",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-008",
              "raw_text": "extreme 28,4 | rest 23,62",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,3",
              "point_of_rest": "23,7",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-009",
              "raw_text": "extreme 19,3 | rest 23,7",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,8",
              "point_of_rest": "23,7",
              "time_of_mid_vibration": "11:05:31",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:05:26"
                },
                {
                  "division": "23",
                  "time_hms": "11:06:01"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-010",
              "raw_text": "extreme 27,8 | rest 23,7 | div 24 @ 11:05:26 | div 23 @ 11:06:01 | mid 11:05:31",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,9",
              "point_of_rest": "23,72",
              "time_of_mid_vibration": "11:12:35",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "11:12:12"
                },
                {
                  "division": "24",
                  "time_hms": "11:12:50"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-011",
              "raw_text": "extreme 19,9 | rest 23,72 | div 23 @ 11:12:12 | div 24 @ 11:12:50 | mid 11:12:35",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,3",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-012",
              "raw_text": "extreme 27,3",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            501,
            502
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "13,5",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-013",
              "raw_text": "extreme 13,5",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,8",
              "point_of_rest": "17,75",
              "time_of_mid_vibration": "11:37:39",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "11:37:34"
                },
                {
                  "division": "17",
                  "time_hms": "11:38:10"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-014",
              "raw_text": "extreme 21,8 | rest 17,75 | div 18 @ 11:37:34 | div 17 @ 11:38:10 | mid 11:37:39",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,9",
              "point_of_rest": "17,67",
              "time_of_mid_vibration": "11:44:45",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "11:44:26"
                },
                {
                  "division": "18",
                  "time_hms": "11:45:04"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-015",
              "raw_text": "extreme 13,9 | rest 17,67 | div 17 @ 11:44:26 | div 18 @ 11:45:04 | mid 11:44:45",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,1",
              "point_of_rest": "17,62",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-016",
              "raw_text": "extreme 21,1 | rest 17,62",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,4",
              "point_of_rest": "17,6",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-017",
              "raw_text": "extreme 14,4 | rest 17,6",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,5",
              "point_of_rest": "17,52",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-018",
              "raw_text": "extreme 20,5 | rest 17,52",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,7",
              "point_of_rest": "17,47",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-019",
              "raw_text": "extreme 14,7 | rest 17,47",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20",
              "point_of_rest": "17,42",
              "time_of_mid_vibration": "0:20:24",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "0:19:57"
                },
                {
                  "division": "17",
                  "time_hms": "0:20:52"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-020",
              "raw_text": "extreme 20 | rest 17,42 | div 18 @ 0:19:57 | div 17 @ 0:20:52 | mid 0:20:24",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "15",
              "point_of_rest": "17,37",
              "time_of_mid_vibration": "0:27:30",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "0:27:15"
                },
                {
                  "division": "18",
                  "time_hms": "0:28:15"
                }
              ],
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-021",
              "raw_text": "extreme 15 | rest 17,37 | div 17 @ 0:27:15 | div 18 @ 0:28:15 | mid 0:27:30",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "19,5",
              "source_page": 502,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIII-ROW-022",
              "raw_text": "extreme 19,5",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            502
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "negative_to_positive",
            "value": "6,12",
            "unit": "divisions"
          },
          {
            "transition": "positive_to_negative",
            "value": "5,97",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "positive",
            "value": "7′6″"
          },
          {
            "position": "negative",
            "value": "7′7″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 22
    },
    {
      "id": "experiment-xiv",
      "experiment_number": 14,
      "roman": "XIV",
      "label": "Experiment XIV",
      "data_key": "CAV-1798-EXP-XIV",
      "heading_original": "EXPERIMENT XIV. May 26.",
      "date_original": "May 26",
      "date_iso": "1798-05-26",
      "date_label": "1798-05-26（原表表記: May 26）",
      "source_pages": [
        503,
        504
      ],
      "sections": [
        {
          "label": "Weights in negative position",
          "mass_position": "negative",
          "rows": [
            {
              "divisions": "16,1",
              "time_hms": "9:18:00",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-001",
              "raw_text": "div 16,1 | time 9:18:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "16,1",
              "time_hms": "9:24:00",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-002",
              "raw_text": "div 16,1 | time 9:24:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "16,1",
              "time_hms": "9:46:00",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-003",
              "raw_text": "div 16,1 | time 9:46:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "16,1",
              "time_hms": "9:49:00",
              "point_of_rest": "16,1",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-004",
              "raw_text": "div 16,1 | time 9:49:00 | rest 16,1",
              "section_label": "Weights in negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            503
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "27,7",
              "time_of_mid_vibration": "10:01:01",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "10:00:46"
                },
                {
                  "division": "22",
                  "time_hms": "10:01:16"
                }
              ],
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-005",
              "raw_text": "extreme 27,7 | div 23 @ 10:00:46 | div 22 @ 10:01:16 | mid 10:01:01",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "17,3",
              "point_of_rest": "22,37",
              "time_of_mid_vibration": "10:08:05",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "10:07:58"
                },
                {
                  "division": "23",
                  "time_hms": "10:08:27"
                }
              ],
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-006",
              "raw_text": "extreme 17,3 | rest 22,37 | div 22 @ 10:07:58 | div 23 @ 10:08:27 | mid 10:08:05",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,2",
              "point_of_rest": "22,5",
              "time_of_mid_vibration": "10:15:09",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "10:15:02"
                },
                {
                  "division": "22",
                  "time_hms": "10:15:32"
                }
              ],
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-007",
              "raw_text": "extreme 27,2 | rest 22,5 | div 23 @ 10:15:02 | div 22 @ 10:15:32 | mid 10:15:09",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,3",
              "point_of_rest": "22,65",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-008",
              "raw_text": "extreme 18,3 | rest 22,65",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,8",
              "point_of_rest": "22,75",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-009",
              "raw_text": "extreme 26,8 | rest 22,75",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,1",
              "point_of_rest": "22,85",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-010",
              "raw_text": "extreme 19,1 | rest 22,85",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,4",
              "point_of_rest": "22,97",
              "time_of_mid_vibration": "10:43:32",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "10:43:40"
                },
                {
                  "division": "22",
                  "time_hms": "10:44:22"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-011",
              "raw_text": "extreme 26,4 | rest 22,97 | div 23 @ 10:43:40 | div 22 @ 10:44:22 | mid 10:43:32 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "20",
              "point_of_rest": "23,15",
              "time_of_mid_vibration": "10:50:41",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "10:49:53"
                },
                {
                  "division": "23",
                  "time_hms": "10:50:37"
                }
              ],
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-012",
              "raw_text": "extreme 20 | rest 23,15 | div 22 @ 10:49:53 | div 23 @ 10:50:37 | mid 10:50:41",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,2",
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-013",
              "raw_text": "extreme 26,2",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            503
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "12,4",
              "time_of_mid_vibration": "11:08:25",
              "division_crossings": [
                {
                  "division": "16",
                  "time_hms": "11:07:53"
                },
                {
                  "division": "17",
                  "time_hms": "11:08:27"
                }
              ],
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-014",
              "raw_text": "extreme 12,4 | div 16 @ 11:07:53 | div 17 @ 11:08:27 | mid 11:08:25",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,5",
              "point_of_rest": "17,02",
              "time_of_mid_vibration": "11:15:27",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "11:15:30"
                },
                {
                  "division": "16",
                  "time_hms": "11:16:03"
                }
              ],
              "source_page": 503,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-015",
              "raw_text": "extreme 21,5 | rest 17,02 | div 17 @ 11:15:30 | div 16 @ 11:16:03 | mid 11:15:27",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "12,7",
              "point_of_rest": "16,9",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-016",
              "raw_text": "extreme 12,7 | rest 16,9",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,7",
              "point_of_rest": "16,85",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-017",
              "raw_text": "extreme 20,7 | rest 16,85",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,3",
              "point_of_rest": "16,82",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-018",
              "raw_text": "extreme 13,3 | rest 16,82",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20",
              "point_of_rest": "16,72",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-019",
              "raw_text": "extreme 20 | rest 16,72",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,6",
              "point_of_rest": "16,67",
              "time_of_mid_vibration": "11:50:58",
              "division_crossings": [
                {
                  "division": "16",
                  "time_hms": "11:50:33"
                },
                {
                  "division": "17",
                  "time_hms": "11:51:19"
                }
              ],
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-020",
              "raw_text": "extreme 13,6 | rest 16,67 | div 16 @ 11:50:33 | div 17 @ 11:51:19 | mid 11:50:58",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "19,5",
              "point_of_rest": "16,65",
              "time_of_mid_vibration": "11:58:06",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "11:57:53"
                },
                {
                  "division": "16",
                  "time_hms": "11:58:44"
                }
              ],
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-021",
              "raw_text": "extreme 19,5 | rest 16,65 | div 17 @ 11:57:53 | div 16 @ 11:58:44 | mid 11:58:06",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XIV-ROW-022",
              "raw_text": "extreme 14",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            503,
            504
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "negative_to_positive",
            "value": "6,27",
            "unit": "divisions"
          },
          {
            "transition": "positive_to_negative",
            "value": "6,13",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "positive",
            "value": "7′6″"
          },
          {
            "position": "negative",
            "value": "7′6″"
          }
        ]
      },
      "notes": [],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 22
    },
    {
      "id": "experiment-xv",
      "experiment_number": 15,
      "roman": "XV",
      "label": "Experiment XV",
      "data_key": "CAV-1798-EXP-XV",
      "heading_original": "EXPERIMENT XV. May 27.",
      "date_original": "May 27",
      "date_iso": "1798-05-27",
      "date_label": "1798-05-27（原表表記: May 27）",
      "source_pages": [
        504,
        505
      ],
      "sections": [
        {
          "label": "Weights in negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "3,9",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-001",
              "raw_text": "extreme 3,9",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "3,35",
              "point_of_rest": "3,61",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-002",
              "raw_text": "extreme 3,35 | rest 3,61",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "3,85",
              "point_of_rest": "3,61",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-003",
              "raw_text": "extreme 3,85 | rest 3,61",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "3,4",
              "source_page": 504,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-004",
              "raw_text": "extreme 3,4",
              "section_label": "Weights in negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            504
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "15,4",
              "time_of_mid_vibration": "10:05:56",
              "division_crossings": [
                {
                  "division": "10",
                  "time_hms": "10:05:59"
                },
                {
                  "division": "9",
                  "time_hms": "10:06:27"
                }
              ],
              "observation_note": "mid-vibration time preserved as printed",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-005",
              "raw_text": "extreme 15,4 | div 10 @ 10:05:59 | div 9 @ 10:06:27 | mid 10:05:56 | mid-vibration time preserved as printed",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "4,8",
              "point_of_rest": "9,95",
              "time_of_mid_vibration": "10:13:05",
              "division_crossings": [
                {
                  "division": "9",
                  "time_hms": "10:12:43"
                },
                {
                  "division": "10",
                  "time_hms": "10:13:11"
                }
              ],
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-006",
              "raw_text": "extreme 4,8 | rest 9,95 | div 9 @ 10:12:43 | div 10 @ 10:13:11 | mid 10:13:05",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "14,8",
              "point_of_rest": "10,07",
              "time_of_mid_vibration": "10:20:13",
              "division_crossings": [
                {
                  "division": "10",
                  "time_hms": "10:20:24"
                },
                {
                  "division": "9",
                  "time_hms": "10:20:56"
                }
              ],
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-007",
              "raw_text": "extreme 14,8 | rest 10,07 | div 10 @ 10:20:24 | div 9 @ 10:20:56 | mid 10:20:13",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "5,9",
              "point_of_rest": "10,23",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-008",
              "raw_text": "extreme 5,9 | rest 10,23",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "14,35",
              "point_of_rest": "10,35",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-009",
              "raw_text": "extreme 14,35 | rest 10,35",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "6,8",
              "point_of_rest": "10,46",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-010",
              "raw_text": "extreme 6,8 | rest 10,46",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "13,9",
              "point_of_rest": "10,52",
              "time_of_mid_vibration": "10:48:42",
              "division_crossings": [
                {
                  "division": "11",
                  "time_hms": "10:48:30"
                },
                {
                  "division": "10",
                  "time_hms": "10:49:11"
                }
              ],
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-011",
              "raw_text": "extreme 13,9 | rest 10,52 | div 11 @ 10:48:30 | div 10 @ 10:49:11 | mid 10:48:42",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "7,5",
              "point_of_rest": "10,6",
              "time_of_mid_vibration": "10:55:48",
              "division_crossings": [
                {
                  "division": "10",
                  "time_hms": "10:55:26"
                },
                {
                  "division": "11",
                  "time_hms": "10:56:10"
                }
              ],
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-012",
              "raw_text": "extreme 7,5 | rest 10,6 | div 10 @ 10:55:26 | div 11 @ 10:56:10 | mid 10:55:48",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "13,5",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XV-ROW-013",
              "raw_text": "extreme 13,5",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            505
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "negative_to_positive",
            "value": "6,34",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "positive",
            "value": "7′7″"
          }
        ]
      },
      "notes": [
        "Before motion, the balls were arranged near the sides of the case on the opposite side from Experiments IX–XI."
      ],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 13
    },
    {
      "id": "experiment-xvi",
      "experiment_number": 16,
      "roman": "XVI",
      "label": "Experiment XVI",
      "data_key": "CAV-1798-EXP-XVI",
      "heading_original": "EXPERIMENT XVI. May 28.",
      "date_original": "May 28",
      "date_iso": "1798-05-28",
      "date_label": "1798-05-28（原表表記: May 28）",
      "source_pages": [
        505,
        506
      ],
      "sections": [
        {
          "label": "Weights in negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "22,55",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-001",
              "raw_text": "extreme 22,55",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "8,4",
              "point_of_rest": "15,09",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-002",
              "raw_text": "extreme 8,4 | rest 15,09",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "21",
              "point_of_rest": "14,9",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-003",
              "raw_text": "extreme 21 | rest 14,9",
              "section_label": "Weights in negative position"
            },
            {
              "extreme_point": "9,2",
              "source_page": 505,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-004",
              "raw_text": "extreme 9,2",
              "section_label": "Weights in negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            505
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "26,6",
              "time_of_mid_vibration": "10:23:15",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "10:22:53"
                },
                {
                  "division": "21",
                  "time_hms": "10:23:20"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-005",
              "raw_text": "extreme 26,6 | div 22 @ 10:22:53 | div 21 @ 10:23:20 | mid 10:23:15",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "15,8",
              "point_of_rest": "21",
              "time_of_mid_vibration": "10:30:30",
              "division_crossings": [
                {
                  "division": "20",
                  "time_hms": "10:30:07"
                },
                {
                  "division": "21",
                  "time_hms": "10:30:36"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-006",
              "raw_text": "extreme 15,8 | rest 21 | div 20 @ 10:30:07 | div 21 @ 10:30:36 | mid 10:30:30",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,8",
              "point_of_rest": "21,05",
              "time_of_mid_vibration": "10:37:45",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "10:37:23"
                },
                {
                  "division": "21",
                  "time_hms": "10:37:55"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-007",
              "raw_text": "extreme 25,8 | rest 21,05 | div 22 @ 10:37:23 | div 21 @ 10:37:55 | mid 10:37:45",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "16,8",
              "point_of_rest": "21,11",
              "time_of_mid_vibration": "10:45:01",
              "division_crossings": [
                {
                  "division": "20",
                  "time_hms": "10:44:29"
                },
                {
                  "division": "21",
                  "time_hms": "10:45:04"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-008",
              "raw_text": "extreme 16,8 | rest 21,11 | div 20 @ 10:44:29 | div 21 @ 10:45:04 | mid 10:45:01",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "25,05",
              "point_of_rest": "21,11",
              "time_of_mid_vibration": "10:52:20",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "10:51:54"
                },
                {
                  "division": "21",
                  "time_hms": "10:52:32"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-009",
              "raw_text": "extreme 25,05 | rest 21,11 | div 22 @ 10:51:54 | div 21 @ 10:52:32 | mid 10:52:20",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "17,57",
              "point_of_rest": "21,2",
              "time_of_mid_vibration": "10:59:34",
              "division_crossings": [
                {
                  "division": "21",
                  "time_hms": "10:59:31"
                },
                {
                  "division": "22",
                  "time_hms": "11:00:13"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-010",
              "raw_text": "extreme 17,57 | rest 21,2 | div 21 @ 10:59:31 | div 22 @ 11:00:13 | mid 10:59:34",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "24,6",
              "point_of_rest": "21,28",
              "time_of_mid_vibration": "11:06:49",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "11:06:24"
                },
                {
                  "division": "21",
                  "time_hms": "11:07:09"
                }
              ],
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-011",
              "raw_text": "extreme 24,6 | rest 21,28 | div 22 @ 11:06:24 | div 21 @ 11:07:09 | mid 11:06:49",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,3",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVI-ROW-012",
              "raw_text": "extreme 18,3",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            506
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "negative_to_positive",
            "value": "6,1",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "positive",
            "value": "7′16″"
          }
        ]
      },
      "notes": [
        "Experiment made by Mr. Gilpin."
      ],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 12
    },
    {
      "id": "experiment-xvii",
      "experiment_number": 17,
      "roman": "XVII",
      "label": "Experiment XVII",
      "data_key": "CAV-1798-EXP-XVII",
      "heading_original": "EXPERIMENT XVII. May 30.",
      "date_original": "May 30",
      "date_iso": "1798-05-30",
      "date_label": "1798-05-30（原表表記: May 30）",
      "source_pages": [
        506,
        507,
        508
      ],
      "sections": [
        {
          "label": "Weights in negative position",
          "mass_position": "negative",
          "rows": [
            {
              "divisions": "17,2",
              "time_hms": "10:19:00",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-001",
              "raw_text": "div 17,2 | time 10:19:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,1",
              "time_hms": "10:25:00",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-002",
              "raw_text": "div 17,1 | time 10:25:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,07",
              "time_hms": "10:29:00",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-003",
              "raw_text": "div 17,07 | time 10:29:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,15",
              "time_hms": "10:40:00",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-004",
              "raw_text": "div 17,15 | time 10:40:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,45",
              "time_hms": "10:49:00",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-005",
              "raw_text": "div 17,45 | time 10:49:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,42",
              "time_hms": "10:51:00",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-006",
              "raw_text": "div 17,42 | time 10:51:00",
              "section_label": "Weights in negative position"
            },
            {
              "divisions": "17,42",
              "time_hms": "11:01:00",
              "point_of_rest": "17,42",
              "source_page": 506,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-007",
              "raw_text": "div 17,42 | time 11:01:00 | rest 17,42",
              "section_label": "Weights in negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            506
          ]
        },
        {
          "label": "Weights moved to positive position",
          "mass_position": "positive",
          "rows": [
            {
              "extreme_point": "28,8",
              "time_of_mid_vibration": "11:11:37",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:11:23"
                },
                {
                  "division": "23",
                  "time_hms": "11:11:49"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-008",
              "raw_text": "extreme 28,8 | div 24 @ 11:11:23 | div 23 @ 11:11:49 | mid 11:11:37",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,1",
              "point_of_rest": "23,2",
              "time_of_mid_vibration": "11:18:42",
              "division_crossings": [
                {
                  "division": "22",
                  "time_hms": "11:18:13"
                },
                {
                  "division": "23",
                  "time_hms": "11:18:43"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-009",
              "raw_text": "extreme 18,1 | rest 23,2 | div 22 @ 11:18:13 | div 23 @ 11:18:43 | mid 11:18:42",
              "section_label": "Weights moved to positive position",
              "observation_note": "CV080A12 source re-audit: crossing divisions are 22 and 23, not 23 and 24."
            },
            {
              "extreme_point": "27,8",
              "point_of_rest": "23,12",
              "time_of_mid_vibration": "11:25:40",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:25:19"
                },
                {
                  "division": "23",
                  "time_hms": "11:25:49"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-010",
              "raw_text": "extreme 27,8 | rest 23,12 | div 24 @ 11:25:19 | div 23 @ 11:25:49 | mid 11:25:40",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "18,8",
              "point_of_rest": "23,2",
              "time_of_mid_vibration": "11:32:43",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "11:32:41"
                },
                {
                  "division": "24",
                  "time_hms": "11:33:13"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-011",
              "raw_text": "extreme 18,8 | rest 23,2 | div 23 @ 11:32:41 | div 24 @ 11:33:13 | mid 11:32:43",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27,38",
              "point_of_rest": "23,31",
              "time_of_mid_vibration": "11:39:44",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:39:28"
                },
                {
                  "division": "23",
                  "time_hms": "11:40:03"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-012",
              "raw_text": "extreme 27,38 | rest 23,31 | div 24 @ 11:39:28 | div 23 @ 11:40:03 | mid 11:39:44",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "19,7",
              "point_of_rest": "23,44",
              "time_of_mid_vibration": "11:46:46",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "11:46:33"
                },
                {
                  "division": "24",
                  "time_hms": "11:47:11"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-013",
              "raw_text": "extreme 19,7 | rest 23,44 | div 23 @ 11:46:33 | div 24 @ 11:47:11 | mid 11:46:46",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "27",
              "point_of_rest": "23,52",
              "time_of_mid_vibration": "11:53:48",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "11:53:36"
                },
                {
                  "division": "23",
                  "time_hms": "11:54:17"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-014",
              "raw_text": "extreme 27 | rest 23,52 | div 24 @ 11:53:36 | div 23 @ 11:54:17 | mid 11:53:48",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "20,4",
              "point_of_rest": "23,57",
              "time_of_mid_vibration": "0:00:55",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "0:00:34"
                },
                {
                  "division": "24",
                  "time_hms": "0:01:18"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-015",
              "raw_text": "extreme 20,4 | rest 23,57 | div 23 @ 0:00:34 | div 24 @ 0:01:18 | mid 0:00:55",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,5",
              "point_of_rest": "23,55",
              "time_of_mid_vibration": "0:07:50",
              "division_crossings": [
                {
                  "division": "24",
                  "time_hms": "0:07:34"
                },
                {
                  "division": "23",
                  "time_hms": "0:08:21"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-016",
              "raw_text": "extreme 26,5 | rest 23,55 | div 24 @ 0:07:34 | div 23 @ 0:08:21 | mid 0:07:50",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "20,8",
              "point_of_rest": "23,59",
              "time_of_mid_vibration": "0:14:58",
              "division_crossings": [
                {
                  "division": "23",
                  "time_hms": "0:14:30"
                },
                {
                  "division": "24",
                  "time_hms": "0:15:24"
                }
              ],
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-017",
              "raw_text": "extreme 20,8 | rest 23,59 | div 23 @ 0:14:30 | div 24 @ 0:15:24 | mid 0:14:58",
              "section_label": "Weights moved to positive position"
            },
            {
              "extreme_point": "26,25",
              "source_page": 507,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-018",
              "raw_text": "extreme 26,25",
              "section_label": "Weights moved to positive position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            507
          ]
        },
        {
          "label": "Weights moved to negative position",
          "mass_position": "negative",
          "rows": [
            {
              "extreme_point": "13,3",
              "time_of_mid_vibration": "0:32:44",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "0:32:19"
                },
                {
                  "division": "18",
                  "time_hms": "0:32:48"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-019",
              "raw_text": "extreme 13,3 | div 17 @ 0:32:19 | div 18 @ 0:32:48 | mid 0:32:44",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "22,4",
              "point_of_rest": "17,95",
              "time_of_mid_vibration": "0:39:44",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "0:39:46"
                },
                {
                  "division": "17",
                  "time_hms": "0:40:19"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-020",
              "raw_text": "extreme 22,4 | rest 17,95 | div 18 @ 0:39:46 | div 17 @ 0:40:19 | mid 0:39:44",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "13,7",
              "point_of_rest": "17,85",
              "time_of_mid_vibration": "0:46:48",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "0:46:26"
                },
                {
                  "division": "18",
                  "time_hms": "0:47:00"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-021",
              "raw_text": "extreme 13,7 | rest 17,85 | div 17 @ 0:46:26 | div 18 @ 0:47:00 | mid 0:46:48",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "21,6",
              "point_of_rest": "17,72",
              "time_of_mid_vibration": "0:53:50",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "0:53:43"
                },
                {
                  "division": "17",
                  "time_hms": "0:54:20"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-022",
              "raw_text": "extreme 21,6 | rest 17,72 | div 18 @ 0:53:43 | div 17 @ 0:54:20 | mid 0:53:50",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14",
              "point_of_rest": "17,6",
              "time_of_mid_vibration": "1:00:55",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "1:00:39"
                },
                {
                  "division": "18",
                  "time_hms": "1:01:20"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-023",
              "raw_text": "extreme 14 | rest 17,6 | div 17 @ 1:00:39 | div 18 @ 1:01:20 | mid 1:00:55",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,8",
              "point_of_rest": "17,47",
              "time_of_mid_vibration": "1:07:59",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "1:07:39"
                },
                {
                  "division": "17",
                  "time_hms": "1:08:21"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-024",
              "raw_text": "extreme 20,8 | rest 17,47 | div 18 @ 1:07:39 | div 17 @ 1:08:21 | mid 1:07:59",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,3",
              "point_of_rest": "17,37",
              "time_of_mid_vibration": "1:15:04",
              "division_crossings": [
                {
                  "division": "17",
                  "time_hms": "1:14:54"
                },
                {
                  "division": "18",
                  "time_hms": "1:15:42"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-025",
              "raw_text": "extreme 14,3 | rest 17,37 | div 17 @ 1:14:54 | div 18 @ 1:15:42 | mid 1:15:04",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "20,1",
              "point_of_rest": "17,27",
              "time_of_mid_vibration": "1:22:05",
              "division_crossings": [
                {
                  "division": "18",
                  "time_hms": "1:21:32"
                },
                {
                  "division": "17",
                  "time_hms": "1:22:22"
                }
              ],
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-026",
              "raw_text": "extreme 20,1 | rest 17,27 | div 18 @ 1:21:32 | div 17 @ 1:22:22 | mid 1:22:05",
              "section_label": "Weights moved to negative position"
            },
            {
              "extreme_point": "14,6",
              "source_page": 508,
              "source_type": "historical",
              "verification": "visual_check_passed",
              "row_id": "EXP-XVII-ROW-027",
              "raw_text": "extreme 14,6",
              "section_label": "Weights moved to negative position"
            }
          ],
          "source_type": "historical",
          "source_pages": [
            508
          ]
        }
      ],
      "summary": {
        "motions": [
          {
            "transition": "negative_to_positive",
            "value": "5,78",
            "unit": "divisions"
          },
          {
            "transition": "positive_to_negative",
            "value": "5,64",
            "unit": "divisions"
          }
        ],
        "vibration_periods": [
          {
            "position": "positive",
            "value": "7′2″"
          },
          {
            "position": "negative",
            "value": "7′3″"
          }
        ]
      },
      "notes": [
        "Experiment made by Mr. Gilpin."
      ],
      "transcription_status": "full_historical_table_imported",
      "source_type": "historical",
      "verification": "visual_check_passed",
      "row_count": 27
    }
  ],
  "conclusion_table": [
    {
      "experiment": 1,
      "transition": "midway_to_positive",
      "motion_arm": "14,32",
      "corrected_motion_arm": "13,42",
      "time_vibration": null,
      "corrected_time_vibration": null,
      "density": "5,5",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 1,
      "transition": "positive_to_midway",
      "motion_arm": "14,1",
      "corrected_motion_arm": "13,17",
      "time_vibration": "14′55″",
      "corrected_time_vibration": null,
      "density": "5,61",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 2,
      "transition": "midway_to_positive",
      "motion_arm": "15,87",
      "corrected_motion_arm": "14,69",
      "time_vibration": null,
      "corrected_time_vibration": null,
      "density": "4,88",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 2,
      "transition": "positive_to_midway",
      "motion_arm": "15,45",
      "corrected_motion_arm": "14,14",
      "time_vibration": "14′42″",
      "corrected_time_vibration": null,
      "density": "5,07",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 3,
      "transition": "positive_to_midway",
      "motion_arm": "15,22",
      "corrected_motion_arm": "13,56",
      "time_vibration": "14′39″",
      "corrected_time_vibration": null,
      "density": "5,26",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 3,
      "transition": "midway_to_positive",
      "motion_arm": "14,5",
      "corrected_motion_arm": "13,28",
      "time_vibration": "14′54″",
      "corrected_time_vibration": null,
      "density": "5,55",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 4,
      "transition": "midway_to_positive",
      "motion_arm": "3,1",
      "corrected_motion_arm": "2,95",
      "time_vibration": null,
      "corrected_time_vibration": "6′54″",
      "density": "5,36",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 4,
      "transition": "positive_to_negative",
      "motion_arm": "6,18",
      "corrected_motion_arm": null,
      "time_vibration": "7′1″",
      "corrected_time_vibration": null,
      "density": "5,29",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 4,
      "transition": "negative_to_positive",
      "motion_arm": "5,92",
      "corrected_motion_arm": null,
      "time_vibration": "7′3″",
      "corrected_time_vibration": null,
      "density": "5,58",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 5,
      "transition": "positive_to_negative",
      "motion_arm": "5,9",
      "corrected_motion_arm": null,
      "time_vibration": "7′5″",
      "corrected_time_vibration": null,
      "density": "5,65",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 5,
      "transition": "negative_to_positive",
      "motion_arm": "5,98",
      "corrected_motion_arm": null,
      "time_vibration": "7′5″",
      "corrected_time_vibration": null,
      "density": "5,57",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 6,
      "transition": "midway_to_negative",
      "motion_arm": "3,03",
      "corrected_motion_arm": "2,9",
      "time_vibration": null,
      "corrected_time_vibration": null,
      "density": "5,53",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 6,
      "transition": "negative_to_positive",
      "motion_arm": "5,9",
      "corrected_motion_arm": "5,71",
      "time_vibration": null,
      "corrected_time_vibration": null,
      "density": "5,62",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 7,
      "transition": "midway_to_negative",
      "motion_arm": "3,15",
      "corrected_motion_arm": "3,02",
      "time_vibration": "7′4″ by mean",
      "corrected_time_vibration": "6′57″",
      "density": "5,29",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 7,
      "transition": "negative_to_positive",
      "motion_arm": "6,1",
      "corrected_motion_arm": "5,9",
      "time_vibration": "7′4″ by mean",
      "corrected_time_vibration": "6′57″",
      "density": "5,44",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 8,
      "transition": "midway_to_negative",
      "motion_arm": "3,13",
      "corrected_motion_arm": "3,00",
      "time_vibration": null,
      "corrected_time_vibration": null,
      "density": "5,34",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 8,
      "transition": "negative_to_positive",
      "motion_arm": "5,72",
      "corrected_motion_arm": "5,54",
      "time_vibration": null,
      "corrected_time_vibration": null,
      "density": "5,79",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 9,
      "transition": "positive_to_negative",
      "motion_arm": "6,32",
      "corrected_motion_arm": null,
      "time_vibration": "6′58″",
      "corrected_time_vibration": null,
      "density": "5,1",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 10,
      "transition": "positive_to_negative",
      "motion_arm": "6,15",
      "corrected_motion_arm": null,
      "time_vibration": "6′59″",
      "corrected_time_vibration": null,
      "density": "5,27",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 11,
      "transition": "positive_to_negative",
      "motion_arm": "6,07",
      "corrected_motion_arm": null,
      "time_vibration": "7′1″",
      "corrected_time_vibration": null,
      "density": "5,39",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 12,
      "transition": "negative_to_positive",
      "motion_arm": "6,09",
      "corrected_motion_arm": null,
      "time_vibration": "7′3″",
      "corrected_time_vibration": null,
      "density": "5,42",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 13,
      "transition": "negative_to_positive",
      "motion_arm": "6,12",
      "corrected_motion_arm": null,
      "time_vibration": "7′6″",
      "corrected_time_vibration": null,
      "density": "5,47",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 13,
      "transition": "positive_to_negative",
      "motion_arm": "5,97",
      "corrected_motion_arm": null,
      "time_vibration": "7′7″",
      "corrected_time_vibration": null,
      "density": "5,63",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 14,
      "transition": "negative_to_positive",
      "motion_arm": "6,27",
      "corrected_motion_arm": null,
      "time_vibration": "7′6″",
      "corrected_time_vibration": null,
      "density": "5,34",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 14,
      "transition": "positive_to_negative",
      "motion_arm": "6,13",
      "corrected_motion_arm": null,
      "time_vibration": "7′6″",
      "corrected_time_vibration": null,
      "density": "5,46",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 15,
      "transition": "negative_to_positive",
      "motion_arm": "6,34",
      "corrected_motion_arm": null,
      "time_vibration": "7′7″",
      "corrected_time_vibration": null,
      "density": "5,3",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 16,
      "transition": "negative_to_positive",
      "motion_arm": "6,1",
      "corrected_motion_arm": null,
      "time_vibration": "7′16″",
      "corrected_time_vibration": null,
      "density": "5,75",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 17,
      "transition": "negative_to_positive",
      "motion_arm": "5,78",
      "corrected_motion_arm": null,
      "time_vibration": "7′2″",
      "corrected_time_vibration": null,
      "density": "5,68",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "experiment": 17,
      "transition": "positive_to_negative",
      "motion_arm": "5,64",
      "corrected_motion_arm": null,
      "time_vibration": "7′3″",
      "corrected_time_vibration": null,
      "density": "5,85",
      "source_page": 520,
      "source_type": "historical",
      "verification": "visual_check_passed"
    }
  ],
  "supplemental_numeric_observations": [
    {
      "category": "iron_rod_trial",
      "value": "17 to 2500",
      "unit": "ratio",
      "quantity": "calculated attraction of iron rods relative to lead weights",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "about 15",
      "unit": "divisions",
      "quantity": "arm deflection attributed to lead weights",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "about 1/10",
      "unit": "division",
      "quantity": "expected deflection from rods alone in one near position",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "about 1/5",
      "unit": "division",
      "quantity": "expected motion when rods moved between near positions",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "first 15",
      "unit": "minutes",
      "quantity": "interval with very little observed arm motion after rod move",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "about 15–30 more",
      "unit": "minutes",
      "quantity": "additional interval before larger motion appeared",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "1/2 or 1 1/2",
      "unit": "division",
      "quantity": "observed delayed arm motion in one trial",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "3",
      "unit": "experiments",
      "quantity": "number of iron-rod trials with same-direction motion",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "1/2–1 1/2",
      "unit": "division",
      "quantity": "range of motion among iron-rod trials",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "not more than 1",
      "unit": "division",
      "quantity": "mean effect attributed to moving iron rods",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "about 15",
      "unit": "divisions",
      "quantity": "effect of moving lead weight from midway to near position",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "iron_rod_trial",
      "value": "not more than 1/30",
      "unit": "whole result",
      "quantity": "estimated maximum result error if iron rods had remained",
      "source_page": 479,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "experiment_I_procedure",
      "value": "11,5 to 25,8",
      "unit": "divisions",
      "quantity": "observed arm displacement caused by attraction",
      "source_page": 481,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "experiment_I_procedure",
      "value": "near 40",
      "unit": "divisions",
      "quantity": "projected excursion without protective intervention",
      "source_page": 481,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "experiment_I_procedure",
      "value": "near 15",
      "unit": "divisions",
      "quantity": "arm motion at which weights were returned to midway to limit swing",
      "source_page": 481,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "early_experiment_summary",
      "value": "not more than 1/10",
      "unit": "part",
      "quantity": "maximum difference between extreme results of first three experiments",
      "source_page": 484,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "early_experiment_summary",
      "value": "half an hour or an hour",
      "unit": "time",
      "quantity": "duration over which mean position continued changing after weight motion",
      "source_page": 484,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "wire_elasticity_trial",
      "value": "about 50",
      "unit": "divisions",
      "quantity": "natural arm position implied by moved index",
      "source_page": 485,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "wire_elasticity_trial",
      "value": "35",
      "unit": "divisions",
      "quantity": "maximum movement allowed by case",
      "source_page": 485,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "wire_elasticity_trial",
      "value": "15",
      "unit": "divisions",
      "quantity": "forced offset from natural position",
      "source_page": 485,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "wire_elasticity_trial",
      "value": "15",
      "unit": "divisions",
      "quantity": "wire twist",
      "source_page": 485,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "wire_elasticity_trial",
      "value": "2 or 3",
      "unit": "hours",
      "quantity": "time wire was held twisted",
      "source_page": 485,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "wire_elasticity_trial",
      "value": "2",
      "unit": "repetitions",
      "quantity": "number of repeated elasticity trials",
      "source_page": 485,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "magnetism_control",
      "value": "1",
      "unit": "day",
      "quantity": "time apparatus remained before next-morning observation",
      "source_page": 491,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "magnetism_control",
      "value": "about 1",
      "unit": "hour",
      "quantity": "time weights remained half-turned before being restored",
      "source_page": 491,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "magnetism_control",
      "value": "2",
      "unit": "other days",
      "quantity": "number of additional repetitions",
      "source_page": 491,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "magnetism_control",
      "value": "2",
      "unit": "magnets",
      "quantity": "number of replacement magnets",
      "source_page": 491,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "magnetism_control",
      "value": "10",
      "unit": "inches",
      "quantity": "length of each replacement magnet",
      "source_page": 491,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "heated_weight_trial",
      "value": "1/2",
      "unit": "hour",
      "quantity": "time after moving heated weights before enlarged effect",
      "source_page": 492,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "heated_weight_trial",
      "value": "14",
      "unit": "divisions",
      "quantity": "arm deflection after heating effect developed",
      "source_page": 492,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "heated_weight_trial",
      "value": "about 3",
      "unit": "divisions",
      "quantity": "arm deflection expected without heating effect",
      "source_page": 492,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "heated_weight_trial",
      "value": "near 1 1/2",
      "unit": "degree",
      "quantity": "thermometer rise",
      "source_page": 492,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "heated_weight_trial",
      "value": "61 to 62 1/2",
      "unit": "degrees",
      "quantity": "thermometer reading change",
      "source_page": 492,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "heated_weight_trial",
      "value": "about 3/4",
      "unit": "inch",
      "quantity": "depth of thermometer hole in one weight",
      "source_page": 492,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "experiments_VI_VIII_summary",
      "value": "0,2–0,5",
      "unit": "division",
      "quantity": "increase in effect after standing one hour",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "experiments_VI_VIII_summary",
      "value": "1",
      "unit": "hour",
      "quantity": "standing interval used for effect comparison",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "experiments_VI_VIII_summary",
      "value": "0,3 or 0,5",
      "unit": "degree",
      "quantity": "weights warmer than air close to case",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "october_17_temperature_trial",
      "value": "7+",
      "unit": "degree",
      "quantity": "weights warmer than air after heating",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "Oct. 17"
    },
    {
      "category": "october_17_temperature_trial",
      "value": "1",
      "unit": "hour",
      "quantity": "cooling interval in negative position",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "Oct. 17"
    },
    {
      "category": "october_17_temperature_trial",
      "value": "1,3",
      "unit": "degree",
      "quantity": "cooling after one hour",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "Oct. 17"
    },
    {
      "category": "october_17_temperature_trial",
      "value": "6",
      "unit": "degree",
      "quantity": "remaining temperature excess after one hour",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "Oct. 17"
    },
    {
      "category": "october_17_temperature_trial",
      "value": "about 4",
      "unit": "divisions",
      "quantity": "additional arm deflection after one hour in each position",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "Oct. 17"
    },
    {
      "category": "may_29_1798_temperature_trial",
      "value": "2",
      "unit": "hours",
      "quantity": "elapsed time before weights were moved",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "May 29, 1798"
    },
    {
      "category": "may_29_1798_temperature_trial",
      "value": "scarcely 0,5",
      "unit": "degree",
      "quantity": "weights warmer than case",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "May 29, 1798"
    },
    {
      "category": "may_29_1798_temperature_trial",
      "value": "about 2",
      "unit": "divisions",
      "quantity": "additional arm deflection after one hour",
      "source_page": 496,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "May 29, 1798"
    },
    {
      "category": "may_23_temperature_trial",
      "value": "about 8",
      "unit": "degree",
      "quantity": "weights colder than air",
      "source_page": 497,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "May 23"
    },
    {
      "category": "may_23_temperature_trial",
      "value": "about 2,5",
      "unit": "divisions",
      "quantity": "reduction of arm deflection after one hour",
      "source_page": 497,
      "source_type": "historical",
      "verification": "visual_check_passed",
      "date_label": "May 23"
    },
    {
      "category": "case_contact_limit",
      "value": "35",
      "unit": "divisions",
      "quantity": "arm reading at which balls begin to touch case",
      "source_page": 500,
      "source_type": "historical",
      "verification": "visual_check_passed"
    }
  ],
  "mean_density_statements": [
    {
      "wire": "first wire",
      "density": "5,48",
      "relative_to": "water",
      "source_page": 521,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "wire": "latter wire",
      "density": "5,48",
      "relative_to": "water",
      "source_page": 521,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "wire": "latter wire",
      "observation_count": "23",
      "extreme_difference": "0,75",
      "max_deviation_from_mean": "0,38",
      "source_page": 521,
      "source_type": "historical",
      "verification": "visual_check_passed"
    }
  ],
  "integrity": {
    "experiment_count": 17,
    "conclusion_row_count": 29,
    "decimal_policy": "original comma strings retained",
    "blank_policy": "unprinted fields omitted; missed observations retained as notes",
    "derived_values": "kept separate from direct transcription",
    "motion_connection": "not connected in CV079A02",
    "apparatus_parameter_count": 49,
    "method_example_row_count": 8,
    "supplemental_numeric_record_count": 48,
    "computation_parameter_count": 21,
    "appendix_case_table_row_count": 3,
    "historical_comparison_count": 3,
    "scope_note": "Complete Experiment I–XVII observation tables plus visually verified narrative observations, apparatus values, key computation constants, conclusion results, Appendix series expressions and 55-value lookup table, and case-attraction calculation table. Formula strings are retained as source transcriptions and are not executed as CAS expressions.",
    "appendix_formula_block_count": 4,
    "appendix_series_argument_count": 10,
    "appendix_series_lookup_value_count": 55
  },
  "apparatus_parameters": [
    {
      "category": "original_michell_apparatus",
      "value": "6",
      "unit": "feet",
      "quantity": "wooden arm length",
      "source_page": 469,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "original_michell_apparatus",
      "value": "40",
      "unit": "inches",
      "quantity": "suspending wire length",
      "source_page": 469,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "original_michell_apparatus",
      "value": "about 2",
      "unit": "inches",
      "quantity": "diameter of each small lead ball",
      "source_page": 469,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "original_michell_apparatus",
      "value": "8",
      "unit": "inches",
      "quantity": "diameter of each large lead weight",
      "source_page": 470,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "force_scale",
      "value": "not more than 1/50,000,000",
      "unit": "ball weight",
      "quantity": "estimated attractive force relative to ball weight",
      "source_page": 470,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "mechanical_clearance",
      "value": "1/5",
      "unit": "inch",
      "quantity": "minimum stop clearance between moving weights and instrument",
      "source_page": 472,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "optical_scale",
      "value": "1/20",
      "unit": "inch",
      "quantity": "primary ivory scale division",
      "source_page": 473,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "optical_scale",
      "value": "5",
      "unit": "parts",
      "quantity": "vernier subdivisions per primary division",
      "source_page": 473,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "optical_scale",
      "value": "1/100",
      "unit": "inch",
      "quantity": "direct readable arm-position resolution",
      "source_page": 473,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "first_wire",
      "value": "39 1/4",
      "unit": "inches",
      "quantity": "length of first suspension wire",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "first_wire",
      "value": "2 4/10",
      "unit": "grains per foot",
      "quantity": "mass per foot of first copper-silvered wire",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "first_wire",
      "value": "about 15",
      "unit": "minutes",
      "quantity": "vibration period with first wire",
      "source_page": 478,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "final_geometry",
      "value": "73,3",
      "unit": "inches",
      "quantity": "distance between centres of the two small balls",
      "source_page": 509,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "final_geometry",
      "value": "36,65",
      "unit": "inches",
      "quantity": "distance from each small-ball centre to centre of motion",
      "source_page": 509,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "reference_pendulum",
      "value": "39,14",
      "unit": "inches",
      "quantity": "length of seconds pendulum in the local climate",
      "source_page": 509,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "optical_scale",
      "value": "38,3",
      "unit": "inches",
      "quantity": "distance from ivory scale to centre of motion",
      "source_page": 509,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "optical_scale",
      "value": "1/20",
      "unit": "inch",
      "quantity": "final apparatus scale division",
      "source_page": 509,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "optical_scale",
      "value": "1/766",
      "unit": "radian arc",
      "quantity": "angle subtended by one division at centre",
      "source_page": 509,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "large_weight_geometry",
      "value": "8,85",
      "unit": "inches",
      "quantity": "large-weight centre distance from middle line of case",
      "source_page": 510,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "large_weight_geometry",
      "value": ",9779",
      "unit": "ratio",
      "quantity": "geometric attraction reduction factor from offset",
      "source_page": 510,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "large_weight_mass",
      "value": "2,439,000",
      "unit": "grains",
      "quantity": "mass of each large lead weight",
      "source_page": 510,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "large_weight_mass",
      "value": "10,64",
      "unit": "spherical feet of water",
      "quantity": "equivalent weight of each large lead weight",
      "source_page": 510,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "earth_reference",
      "value": "41,800,000",
      "unit": "feet",
      "quantity": "mean diameter of Earth used in computation",
      "source_page": 510,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": "4",
      "unit": "parts",
      "quantity": "number of principal arm components",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": "73,3",
      "unit": "inches",
      "quantity": "deal rod length",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": "170",
      "unit": "grains",
      "quantity": "silver wire mass",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": "45",
      "unit": "grains each",
      "quantity": "mass of each end piece carrying ivory vernier",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": "2320",
      "unit": "grains",
      "quantity": "deal rod mass when dry",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": "2400",
      "unit": "grains",
      "quantity": "deal rod mass when very damp",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": ",33",
      "unit": "square inch",
      "quantity": "deal rod cross-sectional area at middle",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_construction",
      "value": ",146",
      "unit": "square inch",
      "quantity": "deal rod cross-sectional area at end",
      "source_page": 512,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "dynamic_equivalent",
      "value": "350",
      "unit": "grains at arm end",
      "quantity": "equivalent inertia of each half of deal rod and wire",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "dynamic_equivalent",
      "value": "48",
      "unit": "grains at arm end",
      "quantity": "equivalent inertia of each end piece",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "dynamic_equivalent",
      "value": "398",
      "unit": "grains at each arm end",
      "quantity": "total arm equivalent inertia",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "small_ball_mass",
      "value": "11,262",
      "unit": "grains",
      "quantity": "mass of each small ball",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "dynamic_equivalent",
      "value": "11,660",
      "unit": "grains",
      "quantity": "equivalent ball mass including arm inertia",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "dynamic_equivalent",
      "value": "1,0353 to 1",
      "unit": "ratio",
      "quantity": "force correction for arm inertia",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "final_geometry",
      "value": "5,5",
      "unit": "inches",
      "quantity": "vertical separation d-b in attraction geometry",
      "source_page": 513,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod",
      "value": "22,000",
      "unit": "grains",
      "quantity": "mass of copper-rod part ad",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod",
      "value": "16",
      "unit": "inches",
      "quantity": "length of copper-rod part ad",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod",
      "value": "41,000",
      "unit": "grains",
      "quantity": "mass of copper-rod part de",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod",
      "value": "46",
      "unit": "inches",
      "quantity": "length of copper-rod part de",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_geometry",
      "value": "1,75",
      "unit": "inches",
      "quantity": "inside box dimension Bb",
      "source_page": 525,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_geometry",
      "value": "3,6",
      "unit": "inches",
      "quantity": "inside box dimension BD",
      "source_page": 525,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_geometry",
      "value": "1,75",
      "unit": "inches",
      "quantity": "inside box dimension Bβ",
      "source_page": 525,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_geometry",
      "value": "5",
      "unit": "inches",
      "quantity": "inside box dimension βA",
      "source_page": 525,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_material",
      "value": ",61",
      "unit": "specific gravity",
      "quantity": "specific gravity of case wood",
      "source_page": 525,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_material",
      "value": "3/4",
      "unit": "inch",
      "quantity": "case wall thickness",
      "source_page": 525,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_motion_limit",
      "value": "1 1/2",
      "unit": "inch",
      "quantity": "greatest arm motion used in case-attraction bound",
      "source_page": 526,
      "source_type": "historical",
      "verification": "visual_check_passed"
    }
  ],
  "observation_method_example": {
    "source_pages": [
      475,
      476
    ],
    "source_type": "historical",
    "verification": "visual_check_passed",
    "rows": [
      {
        "extreme_point": "27,2",
        "division_crossings": [
          {
            "division": "25",
            "time_hms": "10:23:04"
          },
          {
            "division": "24",
            "time_hms": "10:23:57"
          }
        ],
        "time_of_mid_vibration": "10:23:23"
      },
      {
        "extreme_point": "22,1",
        "point_of_rest": "24,6"
      },
      {
        "extreme_point": "27",
        "point_of_rest": "24,7"
      },
      {
        "extreme_point": "22,6",
        "point_of_rest": "24,75"
      },
      {
        "extreme_point": "26,8",
        "point_of_rest": "24,8"
      },
      {
        "extreme_point": "23",
        "point_of_rest": "24,85"
      },
      {
        "extreme_point": "26,6",
        "point_of_rest": "24,9",
        "division_crossings": [
          {
            "division": "25",
            "time_hms": "11:05:22"
          },
          {
            "division": "24",
            "time_hms": "11:06:48"
          }
        ],
        "time_of_mid_vibration": "11:05:22"
      },
      {
        "extreme_point": "23,4"
      }
    ],
    "derived_examples": [
      {
        "quantity": "mean of first and third extreme points",
        "value": "27,1"
      },
      {
        "quantity": "point of rest from first three extremes",
        "value": "24,6"
      },
      {
        "quantity": "point of rest from second through fourth extremes",
        "value": "24,7"
      },
      {
        "quantity": "middle point of first vibration",
        "value": "24,65"
      },
      {
        "quantity": "elapsed time for six vibrations",
        "value": "41′59″"
      },
      {
        "quantity": "time of one vibration",
        "value": "7′0″"
      }
    ]
  },
  "computation_parameters": [
    {
      "category": "baseline_equation",
      "value": "1/(818 N²)",
      "unit": "ball weight",
      "quantity": "force required at each ball for one arm division",
      "source_page": 510,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "baseline_equation",
      "value": "1/(8,739,000 D)",
      "unit": "ball weight",
      "quantity": "large-weight attraction on ball",
      "source_page": 511,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "baseline_equation",
      "value": "N²/(10,683 B)",
      "unit": "density ratio D",
      "quantity": "uncorrected density equation",
      "source_page": 511,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "correction_inventory",
      "value": "6",
      "unit": "corrections",
      "quantity": "number of correction classes enumerated",
      "source_page": 511,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_attraction_correction",
      "value": "128",
      "unit": "grains",
      "quantity": "equivalent attraction on nearest half of deal rod and wire",
      "source_page": 514,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_attraction_correction",
      "value": "29",
      "unit": "grains",
      "quantity": "equivalent attraction on end piece",
      "source_page": 514,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_attraction_correction",
      "value": "157",
      "unit": "grains",
      "quantity": "total equivalent attraction on nearest arm parts",
      "source_page": 514,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_attraction_correction",
      "value": ",0139",
      "unit": "relative to nearest-ball attraction",
      "quantity": "arm-attraction correction fraction",
      "source_page": 514,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "far_ball_correction",
      "value": ",0017",
      "unit": "relative to nearest-ball attraction",
      "quantity": "far-ball attraction fraction",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "far_ball_correction",
      "value": ",9983 to 1",
      "unit": "ratio",
      "quantity": "combined two-ball effect relative to nearest ball",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod_correction",
      "value": "16,300",
      "unit": "grains at weight centre",
      "quantity": "equivalent attraction of copper-rod part ad",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod_correction",
      "value": "2,500",
      "unit": "grains at weight centre",
      "quantity": "equivalent attraction of copper-rod part de",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod_correction",
      "value": "18,800",
      "unit": "grains at weight centre",
      "quantity": "total copper-rod equivalent attraction",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "copper_rod_correction",
      "value": ",00771",
      "unit": "relative to large weight",
      "quantity": "copper-rod attraction fraction",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "combined_attraction_correction",
      "value": "1,0199 to 1",
      "unit": "ratio",
      "quantity": "weight plus rod plus arm and both-ball attraction correction",
      "source_page": 515,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_attraction_bound",
      "value": "1/5",
      "unit": "spherical inch of water at 1 inch",
      "quantity": "maximum case attraction on balls in any arm position",
      "source_page": 516,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "lead_weight_equivalent",
      "value": "234",
      "unit": "spherical inches of water at 1 inch",
      "quantity": "equivalent lead-weight attraction reference",
      "source_page": 516,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "case_attraction_bound",
      "value": "1/1170",
      "unit": "weight attraction",
      "quantity": "upper bound of case attraction relative to lead weight",
      "source_page": 517,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "corrected_equation",
      "value": "N²/(10,844 B)",
      "unit": "density ratio D",
      "quantity": "density equation after arm-inertia and attraction corrections",
      "source_page": 517,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "arm_position_reference",
      "value": "20",
      "unit": "divisions",
      "quantity": "reference arm position for position-dependent correction",
      "source_page": 517,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "category": "position_correction",
      "value": "185",
      "unit": "denominator",
      "quantity": "denominator used in time and motion correction terms",
      "source_page": 519,
      "source_type": "historical",
      "verification": "visual_check_passed"
    }
  ],
  "appendix_case_attraction": {
    "source_pages": [
      523,
      524,
      525,
      526
    ],
    "source_type": "historical",
    "verification": "visual_check_passed",
    "inside_dimensions": {
      "Bb": "1,75",
      "BD": "3,6",
      "Bβ": "1,75",
      "βA": "5",
      "unit": "inches"
    },
    "table": [
      {
        "xc": ",75",
        "βx": "1,05",
        "Ddrg_over_Bbrg": ",2374",
        "mdrp_over_nbrp": ",2374",
        "mesp_over_nasp": ",3705",
        "sum": ",8453",
        "Bbnβ_over_Ddmδ": ",5007",
        "Aanβ_over_Eemδ": ",4677",
        "whole_inside_half_box": ",1231"
      },
      {
        "xc": ",5",
        "βx": "1,3",
        "Ddrg_over_Bbrg": ",1614",
        "mdrp_over_nbrp": ",1614",
        "mesp_over_nasp": ",2516",
        "sum": ",5744",
        "Bbnβ_over_Ddmδ": ",3271",
        "Aanβ_over_Eemδ": ",3079",
        "whole_inside_half_box": ",0606"
      },
      {
        "xc": ",25",
        "βx": "1,55",
        "Ddrg_over_Bbrg": ",0813",
        "mdrp_over_nbrp": ",0813",
        "mesp_over_nasp": ",1271",
        "sum": ",2897",
        "Bbnβ_over_Ddmδ": ",1666",
        "Aanβ_over_Eemδ": ",1525",
        "whole_inside_half_box": ",0234"
      }
    ],
    "specific_gravity_wood": ",61",
    "wall_thickness": "3/4 inch",
    "computed_upper_equivalent": ",201 spherical inches of water at 1 inch",
    "maximum_xc": "less than ,75 inch",
    "greatest_arm_motion": "1 1/2 inch",
    "series_derivation": {
      "source_pages": [
        523,
        524
      ],
      "source_type": "historical",
      "verification": "visual_check_passed",
      "representation": "transcribed expression strings; retained for source fidelity and not evaluated as CAS expressions",
      "formula_blocks": [
        {
          "name": "geometry substitutions",
          "source_page": 523,
          "expressions_original": [
            "ac = a",
            "ck = b",
            "cb = x",
            "a^2 / (a^2 + x^2) = w^2",
            "b^2 / (a^2 + x^2) = v^2"
          ]
        },
        {
          "name": "attraction in direction cb",
          "source_page": 523,
          "expressions_original": [
            "variable part of fluent = -log(v + sqrt(1 + v^2))",
            "whole attraction = log((ck + ak) / ac × ab / (bβ + aβ))"
          ]
        },
        {
          "name": "first series for attraction in direction ac",
          "source_page": 523,
          "expressions_original": [
            "π = b / a",
            "A = arc whose tangent is π",
            "B = A - π",
            "C = B + π^3 / 3",
            "D = C - π^5 / 5",
            "attraction(ac) = sqrt(1 - w^2) × A + B w^2 / 2 + 3 C w^4 / (2·4) + 3·5 D w^6 / (2·4·6) + ..."
          ]
        },
        {
          "name": "second series for attraction in direction ac",
          "source_page": 524,
          "expressions_original": [
            "A = arc whose tangent is 1 / π",
            "B = A - 1 / π",
            "C = B + 1 / (3 π^3)",
            "D = C - 1 / (5 π^5)",
            "attraction(ac) = arc 90° - sqrt(1 + v^2) × A - B v^2 / 2 + 3 C v^4 / (2·4) - 3·5 D v^6 / (2·4·6) + ..."
          ]
        }
      ],
      "lookup_table": {
        "source_page": 524,
        "top_argument": "ck / ak",
        "left_argument": "cb / ab",
        "top_arguments_original": [
          ",1962",
          ",3714",
          ",5145",
          ",6248",
          ",7071",
          ",7808",
          ",8575",
          ",9285",
          ",9815",
          "1,"
        ],
        "rows": [
          {
            "left_argument_original": ",1962",
            "values_original": [
              ",00001"
            ]
          },
          {
            "left_argument_original": ",3714",
            "values_original": [
              ",00039",
              ",00148"
            ]
          },
          {
            "left_argument_original": ",5145",
            "values_original": [
              ",00074",
              ",00277",
              ",00521"
            ]
          },
          {
            "left_argument_original": ",6248",
            "values_original": [
              ",00110",
              ",00406",
              ",00778",
              ",01183"
            ]
          },
          {
            "left_argument_original": ",7071",
            "values_original": [
              ",00140",
              ",00522",
              ",01008",
              ",01525",
              ",02002"
            ]
          },
          {
            "left_argument_original": ",7808",
            "values_original": [
              ",00171",
              ",00637",
              ",01245",
              ",01896",
              ",02405",
              ",03247"
            ]
          },
          {
            "left_argument_original": ",8575",
            "values_original": [
              ",00207",
              ",00772",
              ",01522",
              ",02339",
              ",03116",
              ",03964",
              ",05057"
            ]
          },
          {
            "left_argument_original": ",9285",
            "values_original": [
              ",00244",
              ",00910",
              ",01810",
              ",02807",
              ",03778",
              ",04867",
              ",06319",
              ",08119"
            ]
          },
          {
            "left_argument_original": ",9815",
            "values_original": [
              ",00271",
              ",01019",
              ",02084",
              ",03193",
              ",04368",
              ",05639",
              ",07478",
              ",09931",
              ",12849"
            ]
          },
          {
            "left_argument_original": "1.",
            "values_original": [
              ",00284",
              ",01054",
              ",02135",
              ",03347",
              ",04566",
              ",05975",
              ",07978",
              ",10789",
              ",14632",
              ",19612"
            ]
          }
        ],
        "value_count": 55,
        "instruction_original_summary": "Use ck/ak at the top and cb/ab at the left; add the corresponding logarithm to the logarithms of ck/ak and cb/ab to obtain the logarithm of the attraction."
      }
    }
  },
  "historical_comparisons": [
    {
      "quantity": "final density estimate",
      "value": "5,48",
      "relative_to": "water",
      "uncertainty_statement": "unlikely to differ by as much as 1/14 of the whole",
      "source_page": 522,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "quantity": "experiments conducted with balls close to case sides",
      "value": "IX, X, XI, XV",
      "source_page": 522,
      "source_type": "historical",
      "verification": "visual_check_passed"
    },
    {
      "quantity": "Maskelyne Schehallien density result cited by Cavendish",
      "value": "4 1/2",
      "relative_to": "water",
      "source_page": 522,
      "source_type": "historical",
      "verification": "visual_check_passed"
    }
  ],
  "last_source_reaudit_build": "CV080A12",
  "source_reaudit_corrections": [
    {
      "row_id": "EXP-XIII-ROW-004",
      "field": "division_crossings[1].time_hms",
      "from": "10:23:45",
      "to": "10:22:45"
    },
    {
      "row_id": "EXP-XVII-ROW-009",
      "field": "division_crossings[0].division",
      "from": "23",
      "to": "22"
    },
    {
      "row_id": "EXP-XVII-ROW-009",
      "field": "division_crossings[1].division",
      "from": "24",
      "to": "23"
    }
  ]
});
