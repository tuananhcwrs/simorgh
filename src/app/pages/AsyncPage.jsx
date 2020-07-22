import loadable from '@loadable/component';

const AsyncPage = loadable(() => import('./index'), {
  resolveComponent: (components, props) => components[props.page],
});

export default AsyncPage;
