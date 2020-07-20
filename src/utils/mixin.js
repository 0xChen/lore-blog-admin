import { blogConst, systemConst } from './constant';

const blogConstMixin = {
  data() {
    return { blogConst };
  }
};

const systemConstMixin = {
  data() {
    return { systemConst };
  }
};

export { blogConstMixin, systemConstMixin };
