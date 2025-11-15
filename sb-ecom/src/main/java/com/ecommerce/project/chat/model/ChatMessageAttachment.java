package com.ecommerce.project.chat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageAttachment {
    private String attachmentId;
    private String fileName;
    private String contentType;
    private long fileSize;
    private String url;
}

