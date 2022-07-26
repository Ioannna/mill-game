import CreateRoomBtn from "./create_room_btn";
import EnterName from "./enter-name";
import RoomRow from "./room_row";

const Menu = ({ socket, rooms }) => {
  return (
    <div className="menu">
    <div className="card mt15 p15">
      Mill game
    </div>
    <div className="card mt15 p15">
        <EnterName socket={socket}/>
      </div>
      <div className="card mt20 p15">
        <div className="container">
          <p>Available Rooms</p>
          {rooms.map((room) => (
            <RoomRow key={room.name} socket={socket} name={room} />
          ))}
          <CreateRoomBtn socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
