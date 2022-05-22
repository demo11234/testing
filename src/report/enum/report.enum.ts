export enum ReportReasonEnum {
  SPAM = 'Spam',
  EXPLICIT_SENSITIVE_CONTENT = 'Explicit and sensitive content',
  POSSIBLE_FAKE_SCAM = 'Fake collection or possible scam',
  MIGHT_BE_STOLEN = 'Might be stolen',
  OTHER = 'Other',
}

export enum ReportTypeEnum {
  ITEM = 0,
  COLLECTION = 1,
  USER = 2,
}
