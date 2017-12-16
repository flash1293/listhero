import { withReducer, withProps } from "recompose";
import { compose } from "redux";

const textHandler = withReducer(
  "text",
  "handleChangeText",
  (_, e) => e.target.value,
  ""
);
const submitHandler = withProps(ownerProps => ({
  handleSubmit: () => ownerProps.onSubmit(ownerProps.text)
}));

const enhance = compose(textHandler, submitHandler);

export default enhance(
  ({ text, handleChangeText, dialogId, handleSubmit, onClose }) => (
    <Dialog open={dialogId !== null} onRequestClose={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="editField"
            fullWidth
            autoFocus
            value={text}
            onChange={this.handleChangeText}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button color="primary" onClick={handleSubmit}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  )
);
