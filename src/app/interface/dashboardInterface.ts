

export interface PolicyDetails {
    FH_SYS_ID: number; // Sequence number--you have to generate--header link column
    FH_UW_SYS_ID: number; // Policy sequence number--will come from UW module
    FH_UW_NO: string; // Policy number--will come from UW module
    FH_POL_IDX: number; // End no idx--will come from UW module
    FH_FAC_IDX: number; // You have to generate
    FH_TOD: Date; // Policy to date--will come from UW module
    FH_FMD: Date; // Policy from date--will come from UW module
    FH_VER_NO: string; // You have to generate
    FH_END_DESC: string; // Will come from UW module
    FH_END_TYP: string; // Will come from UW module
    FH_END_CODE: string; // Will come from UW module
    FH_END_TOD: Date; // End to date--will come from UW module
    FH_END_FMD: Date; // End from date--will come from UW module
    FH_FAC_END_YN: number; // Fac endorsement Y/N--will come from UW module
    FH_END_NO: string; // Endorsement number--will come from UW module
    FH_COMP: string; // Company code--will come from UW module
    FH_DIVN: string; // Division--will come from UW module
    FH_DEPT: string; // Department--will come from UW module
    FH_LOB: string; // Line of business--will come from UW module
    FH_COB: string; // Class of business--will come from UW module
    FH_PROD_CODE: string; // Product code--will come from UW module
    FH_SINGLE_PLACE: number; // Single placement Y/N--screen level captured
    FH_BASIS: string; // Placement basis--screen level captured
    FH_PERC_ALL_RSK_YN: number; // Percentage all risk--screen level captured
    FH_FAC_PERC: number; // Fac percentage--screen level captured
  }
  

  export interface RiskData {
    frc_RISK_TYP: string;
    frc_FAC_PML_SI: number;
    frc_FAC_IDX: number;
    frc_FAC_RATE_YN: number;
    frc_FAC_PML_SI_ORG: number;
    frc_END_TOD: number;
    frc_FAC_PREM_LC: number;
    frc_TD_SYS_ID: number;
    frc_POL_IDX: number;
    frc_RATE_PER: number;
    frc_UW_RATE: number;
    frc_SI_ORG: number;
    frc_BUS_TYP: string;
    frc_TD_TTY_ID: string;
    frc_FAC_PERC: number;
    frc_PLACE_REF_NO: number;
    frc_PREM_LC: number;
    frc_FAC_SI_LC: number;
    frc_RISK_REF_NO: number;
    frc_PML_SI_LC_ORG: number;
    frc_SI_LC_ORG: number;
    frc_SI_LC: number;
    frc_RI_SI_YN: number;
    frc_PML_SI_ORG: number;
    frc_REC_TYP: string;
    frc_PML_SI_LC: number;
    frc_OVR_PREM_LC: number;
    frc_SPL_PREM_LC: number;
    frc_PML_PERC: number;
    frc_OVR_PREM: number;
    frc_FH_SYS_ID: number;
    frc_FAC_SI: number;
    frc_FAC_SI_ORG: number;
    frc_FMD: number;
    frc_FAC_RATE: number;
    frc_FAC_PML_SI_LC_ORG: number;
    frc_UR_SYS_ID: number;
    frc_PREM: number;
    frc_END_FMD: number;
    frc_UW_SYS_ID: number;
    frc_TOD: number;
    frc_RATE_TYP: string;
    frc_SYS_ID: number;
    frc_WAR_YN: number;
    frc_PREM_LC_ORG: number;
    frc_PREM_ORG: number;
    frc_PROD_ID: string;
    frc_FAC_PREM_LC_ORG: number;
    frc_PML_SI: number;
    frc_FAC_PML_SI_LC: number;
    frc_CVR_CODE: string;
    frc_FAC_PREM: number;
    frc_FAC_PREM_ORG: number;
    frc_RSK_CAT: string;
    frc_SPL_PREM: number;
    frc_SI: number;
    frc_FAC_SI_LC_ORG: number;
  }

  
export interface SingleCover{
  frc_SYS_ID : string;
  frc_FAC_RATE: string;
  frc_PLACE_REF_NO : string;
}  