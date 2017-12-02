import {arrayMove} from 'react-sortable-hoc';

const initalState = { lists: [
    {
        name: 'Einkaufen',
        items: [
            { name: 'Eier' },
            { name: 'Milch' }
        ]
    }
] };

function replaceByMap(list, index, map) {
    const newList = [...list];
    newList[index] = map(newList[index]);
    return newList;
}

export default function reducer(state = initalState, action) {
    switch (action.type) {
        case 'ADD_LIST':
            return {...state, lists: [...state.lists, { name: action.name, items: [] }] };
        case 'ADD_ITEM':
            return {...state, lists: replaceByMap(state.lists, action.list, (list) => ({...list, items: [...list.items, { name: action.name, done: false}]}))};
        case 'MOVE_ITEM':
            return {...state, lists: replaceByMap(state.lists, action.list, (list) => ({...list, items: arrayMove(list.items, action.oldIndex, action.newIndex)}))};
        case 'TOGGLE_ITEM':
            return {...state, lists: replaceByMap(state.lists, action.list, (list) => ({...list, items: replaceByMap(list.items, action.item, (item) => ({...item, done: !item.done}))}))};
        case 'REMOVE_DONE':
            return {...state, lists: replaceByMap(state.lists, action.list, (list) => ({...list, items: list.items.filter(i => !i.done)}))};
        case 'REMOVE_LIST':
            return {...state, lists: state.lists.filter((_,i) => i !== action.list) };
        default:
            return state
    }
  }