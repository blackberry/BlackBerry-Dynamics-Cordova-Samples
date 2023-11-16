# Secure-ICC sample for Ionic Capacitor with Angular integration

> This sample application is written using the `Ionic` framework with `Capacitor` integration and `Angular` type.
It demonstrates usage of the BlackBerry Dynamics SDK for Cordova and Secure Inter-Container Communication (ICC).

Features include:

* Getting Application Info from the management console.
* Creating and sending files using Secure Inter-Container Communications.
* Composing secure emails to send via BlackBerry Work (or native email client if permitted by policy)
* Secure Storage management

## Requirements
* Node 18.x.x
* Ionic 6 + Capacitor 4 + Angular
* Dynamics SDK for Cordova v12.0
* Dynamics SDK for iOS v12.0 or previous releases (v11.1, v11.2)
* Dynamics SDK for Android v12.0 or previous releases (v11.1, v11.2)

## Author(s)
* [Volodymyr Taliar](mailto:vtaliar@blackberry.com), [Bohdan Pidluzhnyy](mailto:bpidluzhnyy@blackberry.com), [Taras Omelchuk](mailto:tomelchuk@blackberry.com)

**Contributing**
*   To contribute code to this repository you must be
    [signed up as an official contributor](http://blackberry.github.com/howToContribute.html).

## How To Build and Deploy
* Setup your BlackBerry Dynamics environment. See [Getting Started with Blackberry SDK for Cordova](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-cordova/latest)
* Move `Secure-ICC-Ionic-Capacitor-Angular` application to the `SampleApplications` directory of `BlackBerry_Dynamics_SDK_for_Cordova` package
* Open `Secure-ICC-Ionic-Capacitor-Angular` in terminal window:  
`$ cd <path>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/SampleApplications/Secure-ICC-Ionic-Capacitor-Angular`
`$ npm i`
* Add platform:
`$ npx cap add ios`
`$ npx cap add android`
* Add Capacitor Base plugin:
`$ npm i git+https://github.com/blackberry/blackberry-dynamics-cordova-plugins#capacitor-base`
* Build project:
`$ ionic cap build ios`
`$ ionic cap build android`
* Run the `Secure-ICC-Ionic-Capacitor-Angular` application via IDE (Xcode/Android Studio) or using Ionic CLI:
`$ ionic cap run <platform>` 


For more information on BlackBerry Dynamics application development, visit the [BlackBerry Dynamics application developer website](https://developers.blackberry.com/dynamics)


## License

Apache 2.0 License


## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

This sample pairs with Basic-iOS-Swift as examples of iOS apps before and after integrating with the BlackBerry Dynamics SDK. The two samples demostrate features commonly used in the BlackBerry Dynamics applications; secure file storage, secure database, secure communication (HTTP/S and Socket) and more.
