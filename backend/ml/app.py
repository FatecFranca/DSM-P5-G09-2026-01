from flask import Flask, jsonify, request
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__)

@app.route('/classificar', methods=['POST'])
def classificar():

    dados = request.json

    total_income = 0
    total_expense = 0
    qtd_transacoes = 0

    for t in dados:

        if 'amount' not in t:
            continue

        qtd_transacoes += 1

        if t['type'] == 'income':
            total_income += t['amount']

        elif t['type'] == 'expense':
            total_expense += t['amount']

    saldo = total_income - total_expense

    gasto_medio = (
        total_expense / qtd_transacoes
        if qtd_transacoes > 0 else 0
    )

    # Dataset de treinamento
    X = [
        [5000, 1000, 4000],
        [3000, 2500, 500],
        [2000, 3500, -1500],
        [7000, 2000, 5000],
        [2500, 2400, 100]
    ]

    y = [
        'Econômico',
        'Equilibrado',
        'Gastador',
        'Econômico',
        'Equilibrado'
    ]

    modelo = DecisionTreeClassifier()

    modelo.fit(X, y)

    perfil = modelo.predict([
        [total_income, total_expense, saldo]
    ])

    return jsonify({
        'perfil': perfil[0],
        'saldo': saldo,
        'receitas': total_income,
        'despesas': total_expense,
        'gasto_medio': gasto_medio
    })

if __name__ == '__main__':
    app.run(port=5000)