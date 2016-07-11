/// <reference path="../typings/index.d.ts" />
var tiForms;
(function (tiForms) {
    /**
     * Function to convert base64 strings to Uint8Array
     * @data is the string to be converted
     * @returns The raw Uint8Array
     */
    function base64toUint8Array(data) {
        var asStr = atob(data);
        return Uint8Array.from(Array.prototype.map.call(asStr, function (x) { return x.charCodeAt(0); }));
    }
    tiForms.base64toUint8Array = base64toUint8Array;
    /**
     * Function to convert Uint8Array (raw data) to base64
     * @data The Uint8Array to convert
     * @returns The base64 encoded @data as string
     */
    function Uint8ArraytoBase64(data) {
        var binstr = Array.prototype.map.call(data, function (x) {
            return String.fromCharCode(x);
        }).join('');
        return btoa(binstr);
    }
    tiForms.Uint8ArraytoBase64 = Uint8ArraytoBase64;
})(tiForms || (tiForms = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2U2NC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4Q0FBOEM7QUFFOUMsSUFBTyxPQUFPLENBd0JiO0FBeEJELFdBQU8sT0FBTyxFQUFDLENBQUM7SUFFWjs7OztPQUlHO0lBQ0gsNEJBQW1DLElBQVk7UUFDM0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBQSxDQUFDLElBQU0sTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzdGLENBQUM7SUFIZSwwQkFBa0IscUJBR2pDLENBQUE7SUFFRDs7OztPQUlHO0lBQ0gsNEJBQW1DLElBQWdCO1FBQy9DLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBQSxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUxlLDBCQUFrQixxQkFLakMsQ0FBQTtBQUVMLENBQUMsRUF4Qk0sT0FBTyxLQUFQLE9BQU8sUUF3QmIiLCJmaWxlIjoiYmFzZTY0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5cbm1vZHVsZSB0aUZvcm1zIHtcblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGNvbnZlcnQgYmFzZTY0IHN0cmluZ3MgdG8gVWludDhBcnJheVxuICAgICAqIEBkYXRhIGlzIHRoZSBzdHJpbmcgdG8gYmUgY29udmVydGVkXG4gICAgICogQHJldHVybnMgVGhlIHJhdyBVaW50OEFycmF5XG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NHRvVWludDhBcnJheShkYXRhOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcbiAgICAgICAgdmFyIGFzU3RyID0gYXRvYihkYXRhKTtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkuZnJvbShBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYXNTdHIsIHggPT4geyByZXR1cm4geC5jaGFyQ29kZUF0KDApOyB9KSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0byBjb252ZXJ0IFVpbnQ4QXJyYXkgKHJhdyBkYXRhKSB0byBiYXNlNjRcbiAgICAgKiBAZGF0YSBUaGUgVWludDhBcnJheSB0byBjb252ZXJ0XG4gICAgICogQHJldHVybnMgVGhlIGJhc2U2NCBlbmNvZGVkIEBkYXRhIGFzIHN0cmluZ1xuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBVaW50OEFycmF5dG9CYXNlNjQoZGF0YTogVWludDhBcnJheSk6IHN0cmluZyB7XG4gICAgICAgIHZhciBiaW5zdHIgPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoZGF0YSwgeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh4KTtcbiAgICAgICAgfSkuam9pbignJyk7XG4gICAgICAgIHJldHVybiBidG9hKGJpbnN0cik7XG4gICAgfVxuXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
