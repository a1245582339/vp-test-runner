# VP test runner README

An internal tool of running visualparity test

## Features

### CodeLens

CodeLens in spec file

#### For spec

There are 2 types of testing methods.

![p1](https://cdn.statically.io/gh/a1245582339/image-hosting@master/微信图片_20231007083526.6lvbz5uknjo0.webp)

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

If you get the error seems like: `File xxx cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170`, you need to change the PowerShell Execution Policy by follow steps.

1. Open the Powershell as Administrator

2. Run this Command

```ps1
Set-ExecutionPolicy RemoteSigned
```

3. Select "A" and press Enter
![p4](https://cdn.statically.io/gh/a1245582339/image-hosting@master/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20231011161241.7qv7bzoihvc.webp)

4. Rerun the VP test