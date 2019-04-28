import currentListsReducer from "./listReducer";

const reducer = currentListsReducer;

describe("listReducer", () => {
  describe("add list", () => {
    test("add list to empty state", () => {
      const result = reducer([], {
        type: "ADD_LIST",
        name: "Test",
        uid: "1234"
      });
      expect(result).toMatchSnapshot();
    });

    test("add second list", () => {
      const result = reducer(
        [{ items: [], name: "Test 1", uid: "6789", recentItems: [] }],
        { type: "ADD_LIST", name: "Test 2", uid: "1234" }
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe("add item", () => {
    test("add item to empty list", () => {
      const result = reducer(
        [{ items: [], name: "Test 1", uid: "6789", recentItems: [] }],
        {
          type: "ADD_ITEM",
          name: "Test item",
          list: "6789",
          uid: "1234"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add item to list which recently contained that item", () => {
      const result = reducer(
        [
          {
            items: [],
            name: "Test 1",
            uid: "6789",
            recentItems: ["Test item", "something else"]
          }
        ],
        {
          type: "ADD_ITEM",
          name: "Test item",
          list: "6789",
          uid: "1234"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add item to non-existing list", () => {
      const currentState = [
        {
          items: [{ name: "item 1", uid: "676767", stacked: false }],
          name: "Test 1",
          uid: "6789",
          recentItems: []
        }
      ];
      const result = reducer(currentState, {
        type: "ADD_ITEM",
        name: "Test item 2",
        list: "not_existing",
        uid: "1234"
      });
      expect(result).toEqual(currentState);
    });

    test("add item to already populated list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "item 1", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "ADD_ITEM",
          name: "Test item 2",
          list: "6789",
          uid: "1234"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add item with same name to already populated list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "item 1", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "ADD_ITEM",
          name: "item 1",
          list: "6789",
          uid: "1234"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add item with same name to list already populated with a stacked item", () => {
      const result = reducer(
        [
          {
            items: [{ name: "2 thing", uid: "676767", stacked: true }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "ADD_ITEM",
          name: "thing",
          list: "6789",
          uid: "1234"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add stackable item to list without matching items", () => {
      const result = reducer(
        [
          {
            items: [{ name: "item 1", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "ADD_ITEM",
          name: "Test item 2",
          list: "6789",
          uid: "1234",
          stackIfPossible: true
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add stackable item to list with a matching item", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "ADD_ITEM",
          name: "thing",
          list: "6789",
          uid: "1234",
          stackIfPossible: true
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("add stackable item to list with a matching already stacked item", () => {
      const result = reducer(
        [
          {
            items: [{ name: "2 thing", uid: "676767", stacked: true }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "ADD_ITEM",
          name: "thing",
          list: "6789",
          uid: "1234",
          stackIfPossible: true
        }
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe("remove multiple items", () => {
    test("remove multiple items from list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }, { name: "thing2", uid: "1234", stacked: false }, { name: "thing3", uid: "5678", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: [ "thang", "thong" ]
          }
        ],
        {
          type: "REMOVE_MULTIPLE_ITEMS",
          list: "6789",
          items: ["1234", "5678"]
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("remove multiple items from nonexistent list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }, { name: "thing2", uid: "1234", stacked: false }, { name: "thing3", uid: "5678", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: [ "thang", "thong" ]
          }
        ],
        {
          type: "REMOVE_MULTIPLE_ITEMS",
          list: "6780",
          items: ["1234", "5678"]
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("remove all items from list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }, { name: "thing2", uid: "1234", stacked: false }, { name: "thing3", uid: "5678", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: [ "thang", "thong" ]
          }
        ],
        {
          type: "REMOVE_MULTIPLE_ITEMS",
          list: "6789",
          items: ["676767", "1234", "5678"]
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("remove multiple nonexistent items from list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }, { name: "thing2", uid: "1234", stacked: false }, { name: "thing3", uid: "5678", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: [ "thang", "thong" ]
          }
        ],
        {
          type: "REMOVE_MULTIPLE_ITEMS",
          list: "6789",
          items: ["1234", "1235", "1236"]
        }
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe("remove recently used item", () => {
    test("remove item from recently used list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: [ "thang", "thong" ]
          }
        ],
        {
          type: "REMOVE_RECENTLY_USED_ITEM",
          list: "6789",
          item: "thang"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("remove non existent item from recently used list", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: [ "thang" ]
          }
        ],
        {
          type: "REMOVE_RECENTLY_USED_ITEM",
          list: "6789",
          item: "abc"
        }
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe("increase item", () => {
    test("increase unstacked item", () => {
      const result = reducer(
        [
          {
            items: [{ name: "thing", uid: "676767", stacked: false }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "INCREASE_ITEM",
          list: "6789",
          item: "676767"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("increase stacked item", () => {
      const result = reducer(
        [
          {
            items: [{ name: "2 thing", uid: "676767", stacked: true }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "INCREASE_ITEM",
          list: "6789",
          item: "676767"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("increase item on non-existing list", () => {
      const state = [
        {
          items: [{ name: "thing", uid: "676767", stacked: false }],
          name: "Test 1",
          uid: "6789",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "INCREASE_ITEM",
        list: "not_existing",
        item: "676767"
      });
      expect(result).toEqual(state);
    });

    test("increase non-existing item", () => {
      const state = [
        {
          items: [{ name: "thing", uid: "676767", stacked: false }],
          name: "Test 1",
          uid: "6789",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "INCREASE_ITEM",
        list: "6789",
        item: "not_existing"
      });
      expect(result).toEqual(state);
    });
  });

  describe("decrease item", () => {
    test("decrease unstacked item", () => {
      const state = [
        {
          items: [{ name: "thing", uid: "676767", stacked: false }],
          name: "Test 1",
          uid: "6789",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "DECREASE_ITEM",
        list: "6789",
        item: "676767"
      });
      expect(result).toEqual(state);
    });

    test("decrease stacked item", () => {
      const result = reducer(
        [
          {
            items: [{ name: "3 thing", uid: "676767", stacked: true }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "DECREASE_ITEM",
          list: "6789",
          item: "676767"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("decrease stacked item with stack-size of 2", () => {
      const result = reducer(
        [
          {
            items: [{ name: "2 thing", uid: "676767", stacked: true }],
            name: "Test 1",
            uid: "6789",
            recentItems: []
          }
        ],
        {
          type: "DECREASE_ITEM",
          list: "6789",
          item: "676767"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("decrease item on non-existing list", () => {
      const state = [
        {
          items: [{ name: "thing", uid: "676767", stacked: false }],
          name: "Test 1",
          uid: "6789",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "DECREASE_ITEM",
        list: "not_existing",
        item: "676767"
      });
      expect(result).toEqual(state);
    });

    test("decrease non-existing item", () => {
      const state = [
        {
          items: [{ name: "thing", uid: "676767", stacked: false }],
          name: "Test 1",
          uid: "6789",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "DECREASE_ITEM",
        list: "6789",
        item: "not_existing"
      });
      expect(result).toEqual(state);
    });
  });

  describe("move list", () => {
    test("move list to beginning", () => {
      const result = reducer(
        [
          {
            items: [],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2",
            recentItems: []
          }
        ],
        {
          type: "MOVE_LIST",
          oldId: "2",
          newIndex: 0
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move list to end", () => {
      const result = reducer(
        [
          {
            items: [],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2",
            recentItems: []
          }
        ],
        {
          type: "MOVE_LIST",
          oldId: "1",
          newIndex: 1
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move list to center", () => {
      const result = reducer(
        [
          {
            items: [],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2",
            recentItems: []
          },
          {
            items: [],
            name: "Test 3",
            uid: "3",
            recentItems: []
          }
        ],
        {
          type: "MOVE_LIST",
          oldId: "1",
          newIndex: 1
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move list to too high index", () => {
      const result = reducer(
        [
          {
            items: [],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2",
            recentItems: []
          },
          {
            items: [],
            name: "Test 3",
            uid: "3",
            recentItems: []
          }
        ],
        {
          type: "MOVE_LIST",
          oldId: "1",
          newIndex: 100
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move non-existing list", () => {
      const state = [
        {
          items: [],
          name: "Test 1",
          uid: "1",
          recentItems: []
        },
        {
          items: [],
          name: "Test 2",
          uid: "2",
          recentItems: []
        },
        {
          items: [],
          name: "Test 3",
          uid: "3",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "MOVE_LIST",
        oldId: "45",
        newIndex: 100
      });
      expect(result).toEqual(state);
    });
  });

  describe("move item", () => {
    test("move item to beginning", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          }
        ],
        {
          type: "MOVE_ITEM",
          list: "1",
          oldId: "2",
          newIndex: 0
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move item to end", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          }
        ],
        {
          type: "MOVE_ITEM",
          list: "1",
          oldId: "1",
          newIndex: 1
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move item to center", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false },
              { name: "item 3", uid: "3", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          }
        ],
        {
          type: "MOVE_ITEM",
          list: "1",
          oldId: "1",
          newIndex: 1
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move item to too high index", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false },
              { name: "item 3", uid: "3", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          }
        ],
        {
          type: "MOVE_ITEM",
          list: "1",
          oldId: "1",
          newIndex: 100
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move item in non-existing list", () => {
      const state = [
        {
          items: [
            { name: "item 1", uid: "1", stacked: false },
            { name: "item 2", uid: "2", stacked: false },
            { name: "item 3", uid: "3", stacked: false }
          ],
          name: "Test 1",
          uid: "1",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "MOVE_ITEM",
        list: "not_existing",
        oldId: "1",
        newIndex: 100
      });
      expect(result).toEqual(state);
    });

    test("move non-existing item", () => {
      const state = [
        {
          items: [
            { name: "item 1", uid: "1", stacked: false },
            { name: "item 2", uid: "2", stacked: false },
            { name: "item 3", uid: "3", stacked: false }
          ],
          name: "Test 1",
          uid: "1",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "MOVE_ITEM",
        list: "1",
        oldId: "not_existing",
        newIndex: 100
      });
      expect(result).toEqual(state);
    });
  });

  describe("move item to other list", () => {
    test("move item to beginning of other list", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [
              { name: "item 1", uid: "11", stacked: false },
              { name: "item 2", uid: "22", stacked: false }
            ],
            name: "Test 2",
            uid: "2"
          }
        ],
        {
          type: "MOVE_ITEM_TO_LIST",
          oldList: "1",
          newList: "2",
          oldId: "1"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move item to empty list", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2"
          }
        ],
        {
          type: "MOVE_ITEM_TO_LIST",
          oldList: "1",
          newList: "2",
          oldId: "2"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move end item to other list", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false },
              { name: "item 3", uid: "3", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2"
          }
        ],
        {
          type: "MOVE_ITEM_TO_LIST",
          oldList: "1",
          newList: "2",
          oldId: "3"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move center item to other list", () => {
      const result = reducer(
        [
          {
            items: [
              { name: "item 1", uid: "1", stacked: false },
              { name: "item 2", uid: "2", stacked: false },
              { name: "item 3", uid: "3", stacked: false }
            ],
            name: "Test 1",
            uid: "1",
            recentItems: []
          },
          {
            items: [],
            name: "Test 2",
            uid: "2"
          }
        ],
        {
          type: "MOVE_ITEM_TO_LIST",
          oldList: "1",
          newList: "2",
          oldId: "2"
        }
      );
      expect(result).toMatchSnapshot();
    });

    test("move item from non-existing list", () => {
      const state = [
        {
          items: [
            { name: "item 1", uid: "1", stacked: false },
            { name: "item 2", uid: "2", stacked: false },
            { name: "item 3", uid: "3", stacked: false }
          ],
          name: "Test 1",
          uid: "1",
          recentItems: []
        },
        {
          items: [],
          name: "Test 2",
          uid: "2"
        }
      ];
      const result = reducer(state, {
        type: "MOVE_ITEM_TO_LIST",
        oldList: "not_existing",
        newList: "2",
        oldId: "1"
      });
      expect(result).toEqual(state);
    });

    test("move non-existing item to other list", () => {
      const state = [
        {
          items: [
            { name: "item 1", uid: "1", stacked: false },
            { name: "item 2", uid: "2", stacked: false },
            { name: "item 3", uid: "3", stacked: false }
          ],
          name: "Test 1",
          uid: "1",
          recentItems: []
        },
        {
          items: [],
          name: "Test 2",
          uid: "2"
        }
      ];
      const result = reducer(state, {
        type: "MOVE_ITEM_TO_LIST",
        oldList: "1",
        newList: "2",
        oldId: "not_existing"
      });
      expect(result).toEqual(state);
    });

    test("move item to non-existing list", () => {
      const state = [
        {
          items: [
            { name: "item 1", uid: "1", stacked: false },
            { name: "item 2", uid: "2", stacked: false },
            { name: "item 3", uid: "3", stacked: false }
          ],
          name: "Test 1",
          uid: "1",
          recentItems: []
        }
      ];
      const result = reducer(state, {
        type: "MOVE_ITEM_TO_LIST",
        oldList: "1",
        newList: "2",
        oldId: "1"
      });
      expect(result).toMatchSnapshot();
    });
  });
});
