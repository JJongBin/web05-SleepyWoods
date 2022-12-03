import { chat, chatTime, chatUser, info } from './chat.styled';

const ChatContent = ({ data }: { data: any }) => {
  const { type, timestamp, nickname, message } = data;
  console.log(type, timestamp, nickname, message);
  return (
    <li css={chat}>
      {type === 'info' ? (
        <div css={info}>{'📢 INFO :' + nickname + message}</div>
      ) : (
        <>
          <div css={chatUser}>
            <span css={chatTime}>[{timestamp}]</span>
            <span>{nickname}</span>
          </div>
          <span>{message}</span>
        </>
      )}
    </li>
  );
};
export default ChatContent;
