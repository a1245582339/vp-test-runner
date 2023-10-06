# VP test runner README

An internal tool of running visualparity test

## Features

### CodeLens

CodeLens in spec file

#### For spec

There are 2 types of testing methods.

![p1](https://cdn.statically.io/gh/a1245582339/image-hosting@master/20231006133926.6b2aumeeqv00.webp)

* ***Run Local*** is run the vp test with local server env. Equivalent to executing

```shell
npm run test:vp -- -- --local --input "suites/xxx"
```

* ***Run Online*** is run the vp test with online build. Equivalent to executing

```shell
npm run test:vp -- -- --input "suites/xxx"
```

After click the ***Run Online***, there will show an input.

![p2](https://cdn.statically.io/gh/a1245582339/image-hosting@master/20231006185635.4z2cu5cw9v40.webp)

If you want to use the build number, you can input your buildNumber into this input.

#### For test case

The features are same with for spec. But because the vp test dose not provide us the ability to run single test, I added this ability by creating a temporary file. So after you run a single case, two temporary files like ```__temp__xxx.spec.json``` and ```__temp__xxx.metadata.json``` will appear in your folder.

You can remove them before git commit or add this 2 line in your ```.gitignore``` file

```git
_temp_**.spec.json
_temp_**.metadata.json
```

### Right-click menu

Right-click menu of folder and *.spec.json file.

![p3](https://cdn.statically.io/gh/a1245582339/image-hosting@master/20231006133943.mm47r1otadc.webp)

### Report notification

If the vp test is run by a spec file or a singel case, you can open the report in noticaition.

If the vp test is run by a folder, you can open this folder in noticaition.

![p4](https://cdn.statically.io/gh/a1245582339/image-hosting@master/20231006185258.211w3rinpl1c.webp)