import 'package:flutter/widgets.dart';

extension NumExtensions on num {
  Widget get asSpace => SizedBox.square(dimension: toDouble());
}
