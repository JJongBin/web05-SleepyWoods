import Content from '../Content';
import ChatRoom from './ChatRoom';
import { chatWrapper, emptyMessage } from './chat.styled';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatList = ({ setChatTarget }: { setChatTarget: Function }) => {
  const [roomList, setRoomList] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    const getRoomList = async () => {
      try {
        const { data } = await axios('/api/chat/roomList');

        setRoomList(data);
        setIsLoaded(true);
      } catch (e) {}
    };

    getRoomList();
  }, []);

  const selectChatRoom = (e: React.MouseEvent<HTMLElement>) => {
    if (!(e.target instanceof HTMLElement)) return;

    if (e.target.dataset.id) {
      setIsClose(true);

      setTimeout(() => {
        if (!(e.target instanceof HTMLElement)) return;
        setChatTarget(e.target.dataset.id);
      }, 300);
    }
  };

  return (
    <Content isexpand={true}>
      <ul css={chatWrapper(isClose)} onClickCapture={selectChatRoom}>
        {isLoaded &&
          (roomList.length ? (
            roomList.map((data: any) => (
              <ChatRoom key={data.targetUserId} data={data} />
            ))
          ) : (
            <div css={emptyMessage}>😀 친구와 대화를 시작해보세요!</div>
          ))}
      </ul>
    </Content>
  );
};

export default ChatList;
