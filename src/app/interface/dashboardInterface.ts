

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
  