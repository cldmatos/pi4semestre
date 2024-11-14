import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'login_screen.dart';
import 'package:charts_flutter/flutter.dart' as charts;

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<dynamic> _temperatures1 = [];
  List<dynamic> _umidities1 = [];
  List<dynamic> _temperatures2 = [];
  List<dynamic> _umidities2 = [];

  @override
  void initState() {
    super.initState();
    _fetchCompareData();
  }

  Future<void> _fetchCompareData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final url = Uri.parse('http://10.0.2.2:5000/api/auth/compare');

    try {
      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        setState(() {
          _temperatures1 = data['temperaturas']['medida1'] ?? [];
          _temperatures2 = data['temperaturas']['medida2'] ?? [];
          _umidities1 = data['umidades']['medida1'] ?? [];
          _umidities2 = data['umidades']['medida2'] ?? [];
        });
      } else {
        print('Erro ao buscar dados de comparação: ${response.statusCode}');
      }
    } catch (error) {
      print('Erro na requisição: $error');
    }
  }

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
          ),
        ],
      ),
      body: _temperatures1.isEmpty || _temperatures2.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  const Text(
                    "Comparação de Temperaturas",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: SizedBox(
                      height: 200,
                      child: charts.LineChart(
                        [
                          charts.Series<dynamic, int>(
                            id: 'Temperatura 1',
                            colorFn: (_, __) =>
                                charts.MaterialPalette.blue.shadeDefault,
                            domainFn: (dynamic data, int? index) => index ?? 0,
                            measureFn: (dynamic data, _) => data,
                            data: _temperatures1,
                          ),
                          charts.Series<dynamic, int>(
                            id: 'Temperatura 2',
                            colorFn: (_, __) =>
                                charts.MaterialPalette.red.shadeDefault,
                            domainFn: (dynamic data, int? index) => index ?? 0,
                            measureFn: (dynamic data, _) => data,
                            data: _temperatures2,
                          ),
                        ],
                        animate: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    "Comparação de Umidades",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: SizedBox(
                      height: 200,
                      child: charts.LineChart(
                        [
                          charts.Series<dynamic, int>(
                            id: 'Umidade 1',
                            colorFn: (_, __) =>
                                charts.MaterialPalette.blue.shadeDefault,
                            domainFn: (dynamic data, int? index) => index ?? 0,
                            measureFn: (dynamic data, _) => data,
                            data: _umidities1,
                          ),
                          charts.Series<dynamic, int>(
                            id: 'Umidade 2',
                            colorFn: (_, __) =>
                                charts.MaterialPalette.red.shadeDefault,
                            domainFn: (dynamic data, int? index) => index ?? 0,
                            measureFn: (dynamic data, _) => data,
                            data: _umidities2,
                          ),
                        ],
                        animate: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ComparisonDetailsScreen(),
                        ),
                      );
                    },
                    child: const Text("Ver Comparações Detalhadas"),
                  ),
                ],
              ),
            ),
    );
  }
}

class ComparisonDetailsScreen extends StatelessWidget {
  final List<charts.Series<dynamic, String>> data = [
    charts.Series<dynamic, String>(
      id: 'Temperatura',
      domainFn: (dynamic data, _) => data['label'],
      measureFn: (dynamic data, _) => data['value'],
      colorFn: (_, __) => charts.MaterialPalette.blue.shadeDefault,
      data: [
        {'label': 'Média', 'value': 25},
        {'label': 'Mediana', 'value': 25},
        {'label': 'Moda', 'value': 25},
        {'label': 'Desvio Padrão', 'value': 0.25},
        {'label': 'Coeficiente V', 'value': 1},
        {'label': 'Assimetria', 'value': 0},
        {'label': 'Curtose', 'value': 0},
      ],
    ),
    charts.Series<dynamic, String>(
      id: 'Umidade',
      domainFn: (dynamic data, _) => data['label'],
      measureFn: (dynamic data, _) => data['value'],
      colorFn: (_, __) => charts.MaterialPalette.red.shadeDefault,
      data: [
        {'label': 'Média', 'value': 77},
        {'label': 'Mediana', 'value': 77},
        {'label': 'Moda', 'value': 77},
        {'label': 'Desvio Padrão', 'value': 1.5},
        {'label': 'Coeficiente V', 'value': 2},
        {'label': 'Assimetria', 'value': 0.5},
        {'label': 'Curtose', 'value': -0.3},
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Comparações Detalhadas"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Comparação de Temperatura e Umidade",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 300,
              child: charts.BarChart(
                data,
                animate: true,
                barGroupingType: charts.BarGroupingType.grouped,
                behaviors: [charts.SeriesLegend()],
                domainAxis: const charts.OrdinalAxisSpec(
                  renderSpec: charts.SmallTickRendererSpec(labelRotation: 45),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
