import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';

// common
import java from 'highlight.js/lib/languages/java';
import kotlin from 'highlight.js/lib/languages/kotlin';
import cLike from 'highlight.js/lib/languages/c-like';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import swift from 'highlight.js/lib/languages/swift';

// web
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import less from 'highlight.js/lib/languages/less';
import scss from 'highlight.js/lib/languages/scss';

// config
import properties from 'highlight.js/lib/languages/properties';
import yaml from 'highlight.js/lib/languages/yaml';
import nginx from 'highlight.js/lib/languages/nginx';

// script
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import bash from 'highlight.js/lib/languages/bash';
import lua from 'highlight.js/lib/languages/lua';

// other
import markdown from 'highlight.js/lib/languages/markdown';
import json from 'highlight.js/lib/languages/json';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';
import aspectj from 'highlight.js/lib/languages/aspectj';

// Register
hljs.registerLanguage('java', java);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('c-lick', cLike);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('swift', swift);

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('python', python);
hljs.registerLanguage('php', php);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('lua', lua);

hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('less', less);
hljs.registerLanguage('scss', scss);

hljs.registerLanguage('properties', properties);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('nginx', nginx);

hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('json', json);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('aspectj', aspectj);

export default hljs;
