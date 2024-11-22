// lib/repos/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Example: GET request
  final String baseUrl = 'http://192.168.0.147:4000';
  // final String baseUrl = 'http://10.0.2.2:4000';


  Future<dynamic> fetchData(String endpoint, {Map<String, String>? headers}) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.get(url, headers: headers);

      print('Request URL: $url');
      print('Status Code: ${response.statusCode}');
      print('Response Headers: ${response.headers}');
      print('Response Body: ${response.body}');

      // Check the response status code
      if (response.statusCode == 200) {
        return json.decode(response.body); // Parse and return JSON response
      } else {
        throw Exception('Failed to load data. Status code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching data from $endpoint: $e');
    }
  }

  // Example: POST request
  Future<dynamic> postData(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      print(json.decode(response.body));
      return json.decode(response.body);
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}
