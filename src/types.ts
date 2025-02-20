export interface LarkEvent {
    challenge?: string;
    event?: {
      message?: {
        chat_id: string;
        message_id: string;
        content?: string;
      };
    };
  }
  
  export interface LarkMessageContent {
    text?: string;
  }
  