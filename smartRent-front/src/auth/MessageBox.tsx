import React from 'react';
import styled from '@emotion/styled/macro';
import { BoxProps, Box} from "../styles";

const MessageBox: React.FC<BoxProps> = (props: BoxProps) => {
  const {messages, status} = props;

  const messagesText = messages.map((message, index) => {
    return <p key={index}>{message}</p>
  });

  return (
    <Box status={status}>
      {messagesText}
    </Box>
  )
};

export default MessageBox;