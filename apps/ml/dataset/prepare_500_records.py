"""
Machine Learning-Based Bias Analysis and Prediction of Sri Lankan Television News
Dataset Preparation Script: prepare_500_records.py

Annotates the first 500 records of sinhala_politics.csv with:
- Bias Level (Neutral, Low, Medium, High)
- Bias Direction (Neutral, Anti-Government, Pro-Government)

Preserves the existing 40 verified records from sample_labeled_news.csv.
Updates:
1. apps/ml/dataset/data/sinhala_politics.csv (first 500 rows annotated, remaining preserved)
2. apps/ml/dataset/data/sample_labeled_news.csv (all 500 annotated records)
"""

from collections import Counter
from pathlib import Path
import sys
import pandas as pd

# Reconfigure console output for Windows UTF-8
if sys.version_info >= (3, 7):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Comprehensive Sri Lankan political discourse lexicons
HIGH_ANTI_WORDS = [
    'අසමත්', 'අසාර්ථක', 'බංකොලොත්', 'රවටන', 'දඩයමක්', 'මර්දනය', 'වියරුව', 'කොල්ලකන',
    'කළු සල්ලි', 'වහසිබස්', 'පඹයන්', 'බෙල්ල කපා', 'නන් දොඩවනවා', 'අන්ත දූෂිත', 'පයින් ගැසීමක්',
    'පයින් ගැහුවා', 'ජනවරම පාවාදීමක්', 'විසිවෙනවා', 'බය වුණා', 'නඩුත් හාමුදුරුවන්ගේ', 'අධිකාරිවාදයට ආවඩනවා',
    'කැලෑ එළිවෙලා', 'නිකමෙක් කර', 'රබර් මුද්‍රාවක්', 'කියත් මගින්', 'ගෝත්‍රික පාලනයකට',
    'පරදුවට තියලා', 'වෙඩි කන්නට', 'අභූත චෝදනාවක්', 'කැතයි', 'පාරට බහිනවා', 'ඇපත් නෑ',
    'ඒකාධිපති', 'අහසට පොළොව වගේ', 'විනාශ කරනවා', 'ජනතාව රවටන', 'අසාර්ථකයි'
]

MED_ANTI_WORDS = [
    'නොහැකියාව', 'පීඩනයක්', 'උත්තර නෑ', 'සහනයක් නැහැ', 'යොජනාවක් නැහැ', 'මඟ පෙන්වීමක් නැහැ',
    'බුද්ධිමත්ව කටයුතු', 'පරාජය කිරීමට', 'අකුළගන්න', 'භයානකකම', 'එරෙහිව', 'ඩීල්', 'කුමන්ත්‍රණ',
    'බඩුමිල', 'මිල වැඩි', 'හිඟය', 'අර්බුදය', 'විරෝධය', 'චෝදනා', 'අසාධාරණ', 'විනාශ', 'තර්ජනයක්',
    'අනතුරේ', 'අර්බුදයක', 'විවේචන', 'විරෝධතාව', 'කඩා වැටුණු', 'අත්අඩංගුවට', 'අල්ලස්', 'දූෂණ',
    'හොරු', 'පාස්කු ප්‍රෝඩාව', 'මහර සිද්ධිය', 'වැඩ බැරි', 'පරතරය', 'සෑහීමකට පත්වෙන්න බෑ',
    'පැන යන්නෙක්', 'කළ දෙයක් නෑ', 'කින්ඩියක්', 'බරපතළ ප්‍රශ්න', 'අප්‍රසාදය', 'රාජපක්ෂවරුන්ගේත් ආණ්ඩුවේත්',
    'බලය වෙනුවෙන්', 'කැලෑ කපන්න', 'විරෝධයක් තිබියදී', 'හදිසි ඇයි', 'ප්‍රජාතන්ත්‍රවාදය අනතුරේ',
    'ණය බර', 'උද්ඝෝෂණ', 'කප්පාදු', 'බදුබරට', 'අර්බුද'
]

HIGH_PRO_WORDS = [
    'ස්වර්ණමය යුගය', 'විශිෂ්ට ජයග්‍රහණයක්', 'ඓතිහාසික', 'සැමට වඩා උගත්', 'බියෙන් - සැකයෙන් තොරව',
    'බියෙන් සැකයෙන් තොරව', 'අභිමානය', 'සටනේ කෙළවර ජයග්‍රහණයයි', 'ජනතාවාදී වැඩපිළිවෙළට අතදෙමු',
    'දේශපාලන වාසිගන්නවා', 'ප්‍රශ්නවලින් පැන යන්නෙක්', 'සුවිශේෂී ජයග්‍රහණයක්', 'අභිමානවත්'
]

MED_PRO_WORDS = [
    'ඉදිරිගමනට සහාය', 'රට ගොඩනගනවා', 'ජයගන්නවා', 'සහන දෙනවා', 'රැකියා දෙනවා', 'සංවර්ධන',
    'ආරක්ෂා කරනවා', 'සාර්ථකයි', 'ප්‍රතිපාදන', 'ජනතාවට සෙතක්', 'නිවැරදි මාවත', 'විසඳුම් ලබාදෙයි',
    'කැපවී සිටී', 'ස්ථාවර', 'ජනපතිට අලුත් පාර්ලිමේන්තුවක්', 'ජනතාව ජීවත් කරවනවා', 'බඩුමිල අඩුකරනවා',
    'කිසිදාක දෙමළ, මුස්ලිම් ජනයාට එරෙහි වුණේ නෑ', 'මා කළ සටනට ජනපතිත් එක්වුණා', 'රැකියා 54,000',
    'ජනපති කැබිනට් කමිටු', 'පොහොට්ටුවේ ජයග්‍රහණය', 'ආණ්ඩුව සූදානම්', 'රජයේ ප්‍රතිපත්තිය',
    'ජනපති අවධාරණය', 'රජයේ වැඩපිළිවෙළ', 'ප්‍රතිසංස්කරණ', 'ජනතා හිතවාදී', 'සහන පැකේජය',
    'නැවත ගොඩනැගීම', 'ආර්ථික පුනර්ජීවනය', 'සාමය හා සංහිඳියාව', 'විකල්ප නැහැ'
]

NEUTRAL_WORDS = [
    'මැතිවරණ කොමිසම', 'චක්‍රලේඛ', 'ගැසට්', 'දැනුම් දෙයි', 'පාර්ලිමේන්තුව රැස්වෙයි',
    'කාරක සභාව', 'වාර්තාව භාර දෙයි', 'සාකච්ඡාවක්', 'නිල සංචාරය', 'නියෝගය', 'අධිකරණය',
    'පනත් කෙටුම්පත', 'විවාදය', 'සභානායක', 'කථානායක', 'ව්‍යවස්ථාදායක', 'ප්‍රකාශයක් කරයි',
    'තීන්දුව', 'පරිසර තීන්දු', 'අනුශාසනා', 'නීතිය', 'විභාගය', 'ප්‍රතිඵල', 'සම්මුඛ සාකච්ඡාව',
    'නිවේදනයක්', 'සංඛ්‍යාලේඛන', 'දින නියම වෙයි', 'සමුළුව', 'තේරීම් කාරක සභාව'
]


def annotate_first_500() -> None:
    base_dir = Path(__file__).resolve().parent
    data_dir = base_dir / "data"

    politics_csv = data_dir / "sinhala_politics.csv"
    sample_csv = data_dir / "sample_labeled_news.csv"

    print("=" * 78)
    print(" ANNOTATING FIRST 500 RECORDS FOR MACHINE LEARNING TRAINING")
    print("=" * 78)
    print(f"[*] Reading: {politics_csv.resolve()}")

    df_politics = pd.read_csv(politics_csv, encoding="utf-8-sig")
    df_sample = pd.read_csv(sample_csv, encoding="utf-8-sig")

    print(f"[*] Total records in sinhala_politics.csv: {len(df_politics)}")
    print(f"[*] Existing benchmark records in sample_labeled_news.csv: {len(df_sample)}")

    # Retain the exact first 40 annotations from sample_labeled_news
    bias_levels: list = list(df_sample["Bias Level"].iloc[:40])
    bias_directions: list = list(df_sample["Bias Direction"].iloc[:40])

    # Annotate records 40 through 499 (460 records)
    for i in range(40, 500):
        row = df_politics.iloc[i]
        h = str(row["Headline"])
        c = str(row["News Content"])
        full_text = h + " " + c[:600]

        h_ha = any(w in h for w in HIGH_ANTI_WORDS)
        h_hp = any(w in h for w in HIGH_PRO_WORDS)
        h_ma = any(w in h for w in MED_ANTI_WORDS)
        h_mp = any(w in h for w in MED_PRO_WORDS)

        c_ha = sum(1 for w in HIGH_ANTI_WORDS if w in full_text)
        c_hp = sum(1 for w in HIGH_PRO_WORDS if w in full_text)
        c_ma = sum(1 for w in MED_ANTI_WORDS if w in full_text)
        c_mp = sum(1 for w in MED_PRO_WORDS if w in full_text)
        c_neu = sum(1 for w in NEUTRAL_WORDS if w in full_text)

        anti_score = (3 if h_ha else 0) + (2 if h_ma else 0) + c_ha * 2 + c_ma
        pro_score = (3 if h_hp else 0) + (2 if h_mp else 0) + c_hp * 2 + c_mp

        if h_ha or (c_ha >= 1 and anti_score > pro_score * 2 + 1):
            b_dir = "Anti-Government"
            b_lvl = "High"
        elif h_hp or (c_hp >= 1 and pro_score > anti_score * 2 + 1):
            b_dir = "Pro-Government"
            b_lvl = "High"
        elif (h_ma and anti_score > pro_score) or (anti_score >= 4 and anti_score > pro_score + 1):
            b_dir = "Anti-Government"
            b_lvl = "Medium"
        elif (h_mp and pro_score > anti_score) or (pro_score >= 4 and pro_score > anti_score + 1):
            b_dir = "Pro-Government"
            b_lvl = "Medium"
        elif anti_score >= 2 and anti_score > pro_score:
            b_dir = "Anti-Government"
            b_lvl = "Low"
        elif pro_score >= 2 and pro_score > anti_score:
            b_dir = "Pro-Government"
            b_lvl = "Low"
        elif anti_score == 1 and pro_score == 0:
            b_dir = "Anti-Government"
            b_lvl = "Low"
        elif pro_score == 1 and anti_score == 0:
            b_dir = "Pro-Government"
            b_lvl = "Low"
        elif c_neu >= 1 or abs(anti_score - pro_score) <= 1:
            b_dir = "Neutral"
            b_lvl = "Neutral"
        else:
            b_dir = "Neutral"
            b_lvl = "Neutral"

        bias_levels.append(b_lvl)
        bias_directions.append(b_dir)

    print("\n[✓] Generated 500 annotations successfully:")
    print("------------------------------------------------------------------------------")
    print(" Bias Level Distribution:")
    for k, v in Counter(bias_levels).items():
        print(f"   {k:15}: {v:4d} ({v/5:.1f}%)")
    print("\n Bias Direction Distribution:")
    for k, v in Counter(bias_directions).items():
        print(f"   {k:15}: {v:4d} ({v/5:.1f}%)")
    print("------------------------------------------------------------------------------")

    # 1. Update first 500 rows in sinhala_politics.csv
    df_politics["Bias Level"] = df_politics["Bias Level"].astype("object")
    df_politics["Bias Direction"] = df_politics["Bias Direction"].astype("object")
    df_politics.loc[:499, "Bias Level"] = bias_levels
    df_politics.loc[:499, "Bias Direction"] = bias_directions
    df_politics.to_csv(politics_csv, index=False, encoding="utf-8-sig")
    print(f"[✓] Successfully updated first 500 rows in: {politics_csv.resolve()}")

    # 2. Update sample_labeled_news.csv with all 500 records
    df_500 = df_politics.iloc[:500].copy()
    df_500.to_csv(sample_csv, index=False, encoding="utf-8-sig")
    print(f"[✓] Successfully wrote 500 labeled records to: {sample_csv.resolve()}")


if __name__ == "__main__":
    annotate_first_500()
