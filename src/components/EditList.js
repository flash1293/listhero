import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import {
  Link
} from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

const SortableItem = SortableElement(({item}) =>
    <ListItem primaryText={item.name} />
);

const SortableList = SortableContainer(({items}) => {
    return (
    <List>
        {items.map((item, index) => (
        <SortableItem key={item.uid} index={index} item={item} />
        ))}
    </List>
    );
});

export class EditList extends Component {
    state = {
        addText: ''
    };
    onRequestAdd = () => {
        this.setState({ addMode: true }, () => {
            this.addInput.focus();
        });
    }
    onAdd = (e) => {
        e.preventDefault();
        this.props.onAdd(this.state.addText);
        this.setState((state) => ({
            addText: ''
        }));
    }
    onChangeAddText = (_, value) => {
        this.setState({
            addText: value
        });
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        this.props.onMove(this.props.items[oldIndex].uid, this.props.items[newIndex].uid);
    }
    render() {
        const activeItems = this.props.items.filter(i => !i.done);
        const doneItems = this.props.items.filter(i => i.done);
        return (
            <div>
                <AppBar
                    title={`${this.props.name} editieren`}
                    iconElementLeft={<IconButton containerElement={<Link to={`/lists/${this.props.match.params.id}`} />}><NavigationClose /></IconButton>}
                />
                <form onSubmit={this.onAdd} style={{margin: '10px'}}>
                    <TextField fullWidth key="add-textfield" ref={(el) => this.addInput = el} value={this.state.addText} onChange={this.onChangeAddText} hintText="Neuer Eintrag" />
                </form>

                <SortableList items={activeItems} onSortEnd={this.onSortEnd} />
                {doneItems.length > 0 && <Divider inset={true} />}
                {doneItems.length > 0 && <FlatButton labelStyle={{fontSize: '0.7em'}} label="Erledigte Löschen" onClick={this.props.onRemove} />}
                <SortableList items={doneItems} onSortEnd={this.onSortEnd} />
            </div>
        );
    }
}

export const ConnectedEditList = connect((state, ownProps) => ({
    ...state.lists.present.find(l => l.uid === ownProps.match.params.id)
}), (dispatch, ownProps) => ({
    onAdd: (name) => {
        dispatch({
            type: 'ADD_ITEM',
            list: ownProps.match.params.id,
            uid: uuid(),
            name
        });
    },
    onRemove: () => {
        dispatch({
            type: 'REMOVE_DONE',
            list: ownProps.match.params.id
        });
    },
    onMove: (oldId, newId) => {
        dispatch({
            type: 'MOVE_ITEM',
            list: ownProps.match.params.id,
            oldId,
            newId
        });
    }
}))(EditList);