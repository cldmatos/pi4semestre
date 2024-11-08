import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login_screen.dart';
import 'package:fl_chart/fl_chart.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<void> _logout(BuildContext context) async {
    // Remove o token ou qualquer dado de sessão salvo
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token'); // remova ou ajuste conforme seu uso de token

    // Retorna à tela de login
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BarChart(
          BarChartData(
            barGroups: [
              BarChartGroupData(
                x: 1,
                barRods: [
                  BarChartRodData(
                    toY: 10,
                    color: Colors.blue,
                    width: 20,
                  ),
                ],
              ),
              BarChartGroupData(
                x: 2,
                barRods: [
                  BarChartRodData(
                    toY: 15,
                    color: Colors.green,
                    width: 20,
                  ),
                ],
              ),
              BarChartGroupData(
                x: 3,
                barRods: [
                  BarChartRodData(
                    toY: 8,
                    color: Colors.red,
                    width: 20,
                  ),
                ],
              ),
            ],
            borderData: FlBorderData(show: false),
            titlesData: FlTitlesData(show: true),
          ),
        ),
      ),
    );
  }
}
