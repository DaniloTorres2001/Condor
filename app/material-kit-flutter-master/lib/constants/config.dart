String apiUrl = 'http://10.0.2.2:8080/';
String apiKeyMaps = "AIzaSyAL3gSeXMiMFdGgRV14HH3vq74ukMXpRTU";

var dateActual = DateTime.now();
var startDate =
    DateTime.utc(dateActual.year, dateActual.month, dateActual.day, 6, 0, 0);
var endDate =
    DateTime.utc(dateActual.year, dateActual.month, dateActual.day, 20, 0, 0);
const slotCalendarTime = Duration(minutes: 10);

const maxIntentsRequest = 30;
const slotRequestDrive = Duration(seconds: 5);
const slotRequestToDriver = Duration(seconds: 5);
var durationRefreshCareers = Duration(seconds: 20);
