fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios tests

```sh
[bundle exec] fastlane ios tests
```

Runs all the tests

### ios screenshots

```sh
[bundle exec] fastlane ios screenshots
```

Take screenshots

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

### ios increment_vn

```sh
[bundle exec] fastlane ios increment_vn
```

Increment version number

### ios increment_vn_force

```sh
[bundle exec] fastlane ios increment_vn_force
```

Increment version number force

### ios increment_bn

```sh
[bundle exec] fastlane ios increment_bn
```

Increment build number

### ios beta_github

```sh
[bundle exec] fastlane ios beta_github
```

Push a new beta build to TestFlight by Github Actions

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
