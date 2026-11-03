import 'package:flutter/material.dart';

import 'app.dart';
import 'features/home/dashboard_api.dart';
import 'features/sales/sales_counter.dart';

void main() => runApp(
  KubaGestApp(
    loadDashboard: (token) => DashboardApi().load(token),
    loadArticles: loadCounterArticles,
  ),
);
