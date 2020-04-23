# Rainbow Application Unit Testing

All Front End testing are contained within `FrontEndTesting.java`.

All tests are asserted true by default.

Requires Rainbow Sandbox WebClient 1.70.5


## Test Cases

| No. | Name                      | Description<sup>1</sup>                         | Expected Value | Actual Value |
| :-: | :------------------------ | :---------------------------------------------- | :------------: | :----------: |
|     | **Form Validation**       |                                                 |                |              |
|  1  | testFrontPageSuccessful   | All Valid Credentials                           |      True      |     True     |
|  2  | testFrontPageInvalidName1 | Firstname empty                                 |     False      |    False     |
|  3  | testFrontPageInvalidName2 | Lastname empty                                  |     False      |    False     |
|  4  | testFrontPageInvalidName3 | Symbols in Firstname                            |      True      |     True     |
|  5  | testFrontPageInvalidName4 | Symbols in Lastname                             |      True      |     True     |
|  6  | testFrontPageInvalidName5 | 1000 Char Firstname                             |      True      |     True     |
|  7  | testFrontPageInvalidName6 | 1000 Char Lastname                              |      True      |     True     |
|  8  | testFrontPageEmail1       | Invalid Email - "testing.com"                   |     False      |    False     |
|  9  | testFrontPageEmail2       | Invalid Email - "testing@.com"                  |     False      |    False     |
| 10  | testFrontPageEmail3       | Invalid Email - "tes@!ting@.com"                |     False      |    False     |
| 11  | testFrontPageEmail4       | Invalid Email - "testing@.comm"                 |     False      |    False     |
| 12  | testFrontPageEmail5       | Email Empty                                     |     False      |    False     |
|     | **Message Transmission**  |                                                 |                |              |
| 13  | testAgentReceived1        | Message - "hello"                               |      True      |     True     |
| 14  | testAgentReceived2        | Message - "!@#\$%^&\*()\_+1234567890-=,./;[]\\" |      True      |     True     |
| 15  | testAgentReceived3        | Message - " "                                   |      True      |     True     |
| 16  | testAgentReceived4        | Message <sup>**2**</sup> - "d\*1025"            |     False      |    False     |
| 17  | testUserReceived1         | Message - "HELLO"                               |      True      |     True     |
| 18  | testUserReceived2         | Message - "!@#\$%^&\*()\_+1234567890-=,./;[]\\" |      True      |     True     |
| 19  | testUserReceived3         | Message - " "                                   |      True      |     True     |
| 20  | testUserReceived4         | Message <sup>**2**</sup> - "d\*1025"            |     False      |    False     |
|     | **XSS Injection Testing** |                                                 |                |              |
| 21  | testXSSInjection1         | Send a script alert to FirstName LastName input |      True      |     True     |
| 22  | testXSSInjection2         | Send a script alert to send message input       |      True      |     True     |
|     | **Test Queue System**     |                                                 |                |              |
| 23  | testQueueSystem           | Simulate Queuing to Accept A Support Request    |      True      |     True     |

<sup>1</sup> _If input field is not mentioned, it is taken be valid._

<sup>2</sup> _The maximum message length is 1024 chars._
