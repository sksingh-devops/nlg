import React, { useState, useEffect } from "react";
import { Modal, Button, Alert } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ReorderModal = ({ visible, items, onCancel, onOk }) => {
  const [modalItems, setModalItems] = useState([...items]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(modalItems);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setModalItems(reorderedItems);
  };
  useEffect(() => {
    setModalItems(items)
  }, [items]);
  const handleOk = () => {
    // Return the updated order values
    const updatedOrderValues = modalItems.map((item) => ({
      id: item._id,
      order: modalItems.indexOf(item) + 1,
    }));
    onOk(updatedOrderValues);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: "6px",
    margin: "5px",
    color: "white",
    overflow: "hidden",
    background: isDragging ? "rgba(37.05, 98.81, 8.65)" : "black",
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    padding: "8px",
  });

  return (
    <Modal
      title="Reorder Tests"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <div>
      <Alert
                    message="Reorder Tests by Drag and Dropping."
                    type="info"
                    showIcon
                />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {modalItems.map((item, index) => (
                <Draggable
                  key={item._id}
                  draggableId={item._id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      </div>
    </Modal>
  );
};

export default ReorderModal;
