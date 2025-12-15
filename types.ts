export type LanguageCode = 'English' | 'Hindi' | 'Bengali' | 'Marathi' | 'Tamil' | 'Telugu';

export interface CropData {
  season: string;
  crops: string[];
}

export interface ImpactItem {
  name: string;
  value: number;
  boost: string;
  benefit_desc: string;
}

export interface SeasonalTip {
  name: string;
  desc: string;
  icon: string;
}

export interface UIContent {
  // Navigation & General
  menu_title: string;
  developed_by: string;

  // Welcome Page
  welcome_title: string;
  welcome_subtitle: string;
  start_diagnosis: string;
  features_title: string;
  features_list: string[];

  // Analyzer Page
  ai_assistant_title: string;
  upload_label: string;
  symptoms_label: string;
  symptoms_placeholder: string;
  analyze_button: string;
  loading: string;
  ready_to_analyze_title: string;
  ready_to_analyze_desc: string;
  diagnosis_label: string;
  confidence_label: string;
  treatment_title: string;
  watering_title: string;
  prevention_list_title: string;
  
  // Calendar Page
  crop_calendar_title: string;
  crop_calendar_subtitle: string;
  seasons_data: CropData[];
  planning_tips_title: string;
  monsoon_prep: { title: string; desc: string };
  summer_prep: { title: string; desc: string };
  view_details: string;

  // Insights Page
  crop_stats_title: string;
  tech_adoption_title: string;
  tech_adoption_subtitle: string;
  yield_impact_title: string;
  table_headers: { tech: string; boost: string; benefit: string };
  impact_data: ImpactItem[];
  market_title: string;
  market_desc: string;
  open_dashboard: string;

  // Prevention Page
  prevention_title: string;
  general_prevention_title: string;
  general_tips: string[];
  soil_management_title: string;
  soil_tips: string[];
  seasonal_checklist_title: string;
  seasonal_tips: SeasonalTip[];
  pro_tip_title: string;
  pro_tip_desc: string;
}

export interface DiseaseAnalysisResult {
  plant_name: string;
  status: 'Healthy' | 'Diseased' | 'Uncertain';
  disease_name?: string;
  confidence: number;
  treatment_advice: string;
  prevention_tips: string[];
  watering_advice: string;
}
