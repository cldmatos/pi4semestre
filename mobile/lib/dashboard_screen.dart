import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Dashboard"),
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
                    toY: 10, // valor necessário para o eixo Y
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
