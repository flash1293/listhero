import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

export class ViewList extends Component {
    onToggle = (item) => {
        this.props.onToggle(item.uid);
    }
    render() {
        if (!this.props.uid) return <Redirect to="/" />;
        const activeItems = this.props.items.filter(i => !i.done);
        const doneItems = this.props.items.filter(i => i.done);
        return (
            <div>
                <AppBar
                    title={this.props.name}
                    iconElementLeft={<IconButton containerElement={<Link to="/" />}><NavigationClose /></IconButton>}
                    iconElementRight={<FlatButton label="Editieren" containerElement={<Link to={`/lists/${this.props.match.params.id}/edit`} />}/>}
                />
                <List>
                    {activeItems.map((item, index) => (
                        <ListItem key={index} onClick={() => this.onToggle(item)} primaryText={item.name} />
                    ))}
                </List>
                {doneItems.length > 0 && <Divider inset={true} />}
                {doneItems.length > 0 && <FlatButton labelStyle={{fontSize: '0.7em'}} label="Erledigte Löschen" onClick={this.props.onRemove} />}
                <List>
                    {doneItems.map((item, index) => (
                        <ListItem style={{color: '#aaa'}} key={index} onClick={() => this.onToggle(item)} primaryText={item.name} />
                    ))}
                </List>
            </div>
        );
    }
}

export const ConnectedViewList = connect((state, ownProps) => ({
    ...state.lists.present.find(l => l.uid === ownProps.match.params.id)
}), (dispatch, ownProps) => ({
    onRemove: () => {
        dispatch({
            type: 'REMOVE_DONE',
            list: ownProps.match.params.id
        });
    },
    onToggle: (index) => {
        dispatch({
            type: 'TOGGLE_ITEM',
            list: ownProps.match.params.id,
            item: index
        });
    },
}))(ViewList);