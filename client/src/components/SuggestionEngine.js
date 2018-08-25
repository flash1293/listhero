import compose from "ramda/src/compose";
import values from "ramda/src/values";
import flatten from "ramda/src/flatten";
import { lifecycle, withState } from "recompose";
import Bloodhound from "bloodhound-js";

import categoryList from "../data/categories.json";

const EMPTY_ARRAY = [];

function slidingTokenizer(str) {
  str = String(str);
  var words = [];

  for (var offs = 0; offs <= str.length - 4; offs++) {
    words.push(str.substr(offs));
  }
  return words;
}

function initializeSuggestionEngine(recentItems, setSuggestionHandler) {
  const engine = new Bloodhound({
    local: recentItems.concat(flatten(values(categoryList))),
    queryTokenizer: Bloodhound.tokenizers.nonword,
    datumTokenizer: slidingTokenizer
  });
  engine.initialize().then(() => setSuggestionHandler(engine));
}

export default compose(
  withState("suggestionHandler", "setSuggestionHandler", null),
  withState("suggestions", "setSuggestions", []),
  lifecycle({
    componentDidMount() {
      const { recentItems, setSuggestionHandler } = this.props;
      initializeSuggestionEngine(recentItems, setSuggestionHandler);
    },
    componentWillReceiveProps(nextProps) {
      if(this.props.recentItems !== nextProps.recentItems) {
        initializeSuggestionEngine(nextProps.recentItems, nextProps.setSuggestionHandler);
      }
      if (nextProps.text !== this.props.text) {
        if (nextProps.text && nextProps.text.length >= 2 && nextProps.suggestionHandler) {
          nextProps.suggestionHandler.search(nextProps.text, results =>
            nextProps.setSuggestions(results)
          );
        } else {
          nextProps.setSuggestions(EMPTY_ARRAY);
        }
      }
    }
  })
);
