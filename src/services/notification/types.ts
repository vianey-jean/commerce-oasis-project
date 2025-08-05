
export interface NotificationSettings {
  reminders: {
    enabled: boolean;
    times: number[];
  };
  email: {
    enabled: boolean;
    confirmations: boolean;
    reminders: boolean;
  };
  desktop: {
    enabled: boolean;
    sound: boolean;
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
  };
}
