const { AwsCdkTypeScriptApp, web } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.103.0',
  jsiiFqn: "projen.AwsCdkTypeScriptApp",
  name: 'projen-next-cdk',

  cdkDependencies: [
    '@aws-cdk/aws-appsync',
    '@aws-cdk/aws-cognito',
    '@aws-cdk/aws-amplify',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-codebuild',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/core',
  ],

  deps: [
    'cdk-appsync-transformer',
  ],
});

project.synth();

const webProject = new web.NextJsTypeScriptProject({
  name: 'next-frontend',
  parent: project,
  outdir: 'frontend',
  defaultReleaseBranch: 'main',

  deps: [
    '@aws-amplify/auth',
    '@aws-amplify/ui-components',
    '@aws-amplify/ui-react',
    'aws-amplify',
    'env-cmd',
    'uuid'
  ],

  devDeps: [
    'eslint-config-next'
  ],

  tsconfig: {
    compilerOptions: {
      baseUrl: ".",
      rootDir: '.',
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: false,
      module: 'esnext',
      moduleResolution: 'node',
      isolatedModules: true,
      noEmit: true,
      jsx: 'preserve',
    },
    include: [
      "**/*.ts",
      "**/*.tsx"
    ],
  },

});

webProject.setScript("start:local", "env-cmd -f .env.local")

webProject.synth();