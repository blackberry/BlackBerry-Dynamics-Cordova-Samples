# InAppBrowser Sample App for Cordova

This sample application demonstrates usage of `cordova.InAppBrowser.open` API of BlackBerry Dynamics Cordova InAppBrowser plugin to securely open helpful articles, videos, and web resources inside of your app without leaving your app.

## Requirements

- Node 18.x.x
- Cordova 11.0, 11.1, 12.0
- Dynamics SDK for Cordova v12.1
- Dynamics SDK for iOS v12.1 or previous releases (v11.2, v12.0)
- Dynamics SDK for Android v12.1 or previous releases (v11.2, v12.0)

## How To Build and Deploy

- Setup your BlackBerry Dynamics environment. See [Getting Started with Blackberry SDK for Cordova](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-cordova/)
- Move `InAppBrowser` application to the `SampleApplications` directory of `BlackBerry_Dynamics_SDK_for_Cordova` package
- Open InAppBrowser in Terminal window:  
  `$ cd <path>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/SampleApplications/InAppBrowser`
- Install the plugin `cordova-plugin-bbd-base`:  
  `$ cordova plugin add <path>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-base`
- For iOS:
- `$ cordova platform add ios`
- `$ cordova build ios`
- AND/OR for Android:
- `$ cordova platform add android`
- `$ cordova build android`
- run the "InAppBrowser" application via IDE (Xcode/Android Studio) or using Cordova CLI

For more information on BlackBerry Dynamics application development, visit the [BlackBerry Dynamics application developer website](https://developers.blackberry.com/dynamics)

## License

Apache 2.0 License

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
