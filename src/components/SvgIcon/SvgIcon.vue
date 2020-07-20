<script>
import Icon from '@ant-design/icons-vue';
import * as customIcon from '@/icons';
import * as antdIcon from './AntdIcon';

export default {
  name: 'Icon',
  functional: true,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  render(createElement, context) {
    let iconName = (context.props.name);
    if (Object.prototype.hasOwnProperty.call(customIcon, iconName)) {
      context.data.props = { component: customIcon[iconName] };
      return createElement(Icon, context.data, context.children);
    }

    const defaultTheme = 'Outlined';
    iconName = iconName.replace(/^[a-z]/, s => s.toUpperCase());

    if (!/(Outlined|Filled|TwoTone)$/i.test(iconName)) {
      iconName += defaultTheme;
    }
    return createElement(antdIcon[iconName], context.data, context.children);
  }
};
</script>
