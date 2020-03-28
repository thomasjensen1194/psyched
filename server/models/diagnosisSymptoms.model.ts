import { Model } from 'objection';

interface DiagnosisSymptoms {
  symptomId: number;
  diagnosisId: number;
  userId: number;
  point: number;
}

class DiagnosisSymptoms extends Model {
  static tableName = 'diagnosisSymptoms';
  static idColumn = ['symptomId', 'diagnosisId'];
}

export default DiagnosisSymptoms;
