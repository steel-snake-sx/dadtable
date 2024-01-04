import dynamic from 'next/dynamic';

const DragDropContext = dynamic(
    () =>
        import('react-beautiful-dnd').then(mod => {
            return mod.DragDropContext;
        }),
    {ssr: false},
);
const Droppable = dynamic(
    () =>
        import('react-beautiful-dnd').then(mod => {
            return mod.Droppable;
        }),
    {ssr: false},
);
const Draggable = dynamic(
    () =>
        import('react-beautiful-dnd').then(mod => {
            return mod.Draggable;
        }),
    {ssr: false},
);

import './MyTable.css';
import { useState } from 'react';

// Исходные данные
let initialColumns = Array.from({ length: 15 }, (_, i) => `col ${i + 1}`);
const rows = Array.from({ length: 10 }, (_, i) => `row ${i + 1}`);

function MyTable() {
    // Состояние для колонок
    const [columns, setColumns] = useState(initialColumns);

    // Обработчик события onDragEnd
    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Игнорируем, если колонка перетащена за пределы области
        // или если элемент был перетащен в ту же самую позицию
        if (!destination || source.index === destination.index) {
            return;
        }

        // Создаем новый массив колонок, удаляя колонку из исходной позиции
        // и вставляя ее в позицию назначения
        const newColumns = Array.from(columns);
        const [removed] = newColumns.splice(source.index, 1);
        newColumns.splice(destination.index, 0, removed);

        // Обновляем состояние
        setColumns(newColumns);
    };

    return (
        <div className="table-container"> {/* Добавлен контейнер для центрирования */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided) => (
                        <table {...provided.droppableProps} ref={provided.innerRef} className="custom-table">
                            <thead>
                            <tr>
                                {columns.map((col, index) => (
                                    <Draggable key={col} draggableId={col} index={index}>
                                        {(provided) => (
                                            <th {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                {col}
                                            </th>
                                        )}
                                    </Draggable>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row) => (
                                <tr key={row}>
                                    {columns.map((col) => (
                                        <td key={col}>{`${col}`}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default MyTable;
