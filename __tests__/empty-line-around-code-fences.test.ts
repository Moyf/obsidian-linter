import EmptyLineAroundCodeFences from '../src/rules/empty-line-around-code-fences';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: EmptyLineAroundCodeFences,
  testCases: [
    {
      testName: 'Make sure multiple blank lines at the start and end are removed',
      before: dedent`
        ${''}
        ${''}
        \`\`\`JavaScript
        var text = 'some string';
        \`\`\`
        ${''}
        ${''}
      `,
      after: dedent`
        \`\`\`JavaScript
        var text = 'some string';
        \`\`\`
      `,
    },
    {
      testName: 'Make sure multiple blank lines at the start and end are removed when dealing with blockquotes or callouts',
      before: dedent`
        >
        > ${''}
        > \`\`\`JavaScript
        > var text = 'some string';
        > \`\`\`
        > ${''}
        >
      `,
      after: dedent`
        > \`\`\`JavaScript
        > var text = 'some string';
        > \`\`\`
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/456
      testName: 'Make sure that there is only 1 empty line be around a fenced code block even if the code block is indented',
      before: dedent`
        1. 修改 php.ini
        ${''}
            \`\`\`
            upload_max_filesize = 20M
            post_max_size = 20M
            \`\`\`
        ${''}
        2. 修改 Nginx 配置文件
        ${''}
            \`\`\`
            client_max_body_size    20m; # 文件最大大小
            \`\`\`
        ${''}
        1111
        ${''}
          \`\`\`
          int a = 0;
          \`\`\`
        ${''}
        2222
      `,
      after: dedent`
        1. 修改 php.ini
        ${''}
            \`\`\`
            upload_max_filesize = 20M
            post_max_size = 20M
            \`\`\`
        ${''}
        2. 修改 Nginx 配置文件
        ${''}
            \`\`\`
            client_max_body_size    20m; # 文件最大大小
            \`\`\`
        ${''}
        1111
        ${''}
          \`\`\`
          int a = 0;
          \`\`\`
        ${''}
        2222
      `,
    },
    { // accounts for https://github.com/platers/obsidian-linter/issues/833
      testName: 'Make sure that a callout with a code block is not broken apart',
      before: dedent`
        > [!abstract]- Mentions
        > \`\`\`dataview
        > XXX
        > \`\`\`
      `,
      after: dedent`
        > [!abstract]- Mentions
        >
        > \`\`\`dataview
        > XXX
        > \`\`\`
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/833
      testName: 'Make sure that a callout with a code block followed by another callout does not get merged',
      before: dedent`
        > [!abstract]- Mentions
        > \`\`\`dataview
        > XXX
        > \`\`\`
        ${''}
        > [!abstract]- Mentions2
        >
        > Other content
      `,
      after: dedent`
        > [!abstract]- Mentions
        >
        > \`\`\`dataview
        > XXX
        > \`\`\`
        ${''}
        > [!abstract]- Mentions2
        >
        > Other content
      `,
    },
    { // relates to https://github.com/platers/obsidian-linter/issues/833
      testName: 'Make sure that a nested callout with a code block does not get broken apart',
      before: dedent`
        > [!abstract]- Mentions
        > > [!abstract]- Mentions2
        > > \`\`\`dataview
        > > XXX
        > > \`\`\`
      `,
      after: dedent`
        > [!abstract]- Mentions
        > > [!abstract]- Mentions2
        > >
        > > \`\`\`dataview
        > > XXX
        > > \`\`\`
      `,
    },
    { // fixes https://github.com/platers/obsidian-linter/issues/1074
      testName: 'Make sure that a nested callout with a code block does not get joined together',
      before: dedent`
        > [!multi-column]
        >
        > > \`\`\`
        > > some query or basic code-block
        > > \`\`\`
        >
        > > \`\`\`
        > > another query or basic code-block
        > > \`\`\`
      `,
      after: dedent`
        > [!multi-column]
        >
        > > \`\`\`
        > > some query or basic code-block
        > > \`\`\`
        >
        > > \`\`\`
        > > another query or basic code-block
        > > \`\`\`
      `,
    },
  ],
});
