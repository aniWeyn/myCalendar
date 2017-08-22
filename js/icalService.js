define([], function () {
    
    var apiUrlPath = 'https://cors.now.sh/https://innsida.ntnu.no/user/sabinan/student/timeplan?p_p_id=timeplanportlet_WAR_timeplanportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=schedulesIcal&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=1';
    
        function readICalendar() {
            return fetch(apiUrlPath)
                .then(function (response) {
                    return response.text();
                })
                .then(function (data) {
                    var category = "issEvent"
                    return parseToObject(data, category);
                })
        }
    
    function parseToObject(iCalendarData, category) {

        var jcalData = ICAL.parse(iCalendarData);
        var comp = new ICAL.Component(jcalData);
        var vevent = comp.getAllSubcomponents("vevent");
        var events = vevent.map(function (event_row) {
            var event = new ICAL.Event(event_row);
            var startDate = moment(event.startDate.toUnixTime() * 1000)
            return {
                summary: event.summary,
                start: startDate.unix(),
                location: event.location,
                description: event.description,
                category: category
            }
        })
        return events
    }


    var homeworkUrl = "calendar/homework.json";

    function readHomework() {
        return fetch(homeworkUrl)
            .then(extractJsonFromResp)
            .then(transformDataInEvents)
    }

    function extractJsonFromResp(response) {
        return response.json()
    }

    function toUnixTime(data) {
        return moment(data, "DD.MM.YYYY").unix()
    }

    function transformDataInEvents(events) {
        return events.map(function (event) {
            event.start = toUnixTime(event.start)
            return event
        })
    }

    return {
        readHomework: readHomework,
        readICalendar: readICalendar
    }
});