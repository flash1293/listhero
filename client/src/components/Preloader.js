import { withState, lifecycle, withProps } from "recompose";
import compose from "ramda/src/compose";
import mapObjIndexed from "ramda/src/mapObjIndexed";
import { asyncComponent } from "./AsyncComponent";

export default moduleLoaders => component =>
  compose(
    withState("modules", "setModules", {}),
    withState("modulePromises", "setModulePromises", {}),
    lifecycle({
      componentDidMount() {
        const { modules, setModules, setModulePromises } = this.props;
        setModulePromises(
          mapObjIndexed(
            (moduleLoader, name) =>
              moduleLoader().then(loadedModule => {
                setModules({
                  ...modules,
                  name: loadedModule
                });
                return loadedModule;
              }),
            moduleLoaders
          )
        );
      }
    }),
    withProps(ownProps =>
      mapObjIndexed((modulePromise, name) => {
        if (ownProps.modules[name]) {
          return asyncComponent(() => Promise.resolve(ownProps.modules[name]));
        } else {
          return asyncComponent(() => modulePromise);
        }
      }, ownProps.modulePromises)
    )
  )(component);
