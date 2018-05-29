import _ from 'lodash'
import ShogiManager from '../src/shogi-manager'
import KomaInfo from '../src/const/komaInfo'
import { BOARD } from '../src/const/const'

// jsonフォーマットのjkf形式による棋譜データ
const jkfData = {
  header: {
    proponent_name: '先手善治',
    opponent_name: '後手魔太郎',
    title: 'テスト棋譜',
    place: '畳',
    start_time: '2003/05/03 10:30:00',
    end_time: '2003/05/03 10:30:00',
    limit_time: '00:25+00',
    style: 'YAGURA'
  },
  initial: {
    preset: 'HIRATE'
  },
  moves: [
    { comments: ['分岐の例'] },
    {
      move: {
        from: { x: 7, y: 7 },
        to: { x: 7, y: 6 },
        color: 0,
        piece: 'FU'
      }
    },
    {
      move: {
        from: { x: 3, y: 3 },
        to: { x: 3, y: 4 },
        color: 1,
        piece: 'FU'
      },
      comments: [
        '次の手で二種類が考えられる：７七桂か２二角成である．',
        '２二角成を選ぶと筋違い角となる．'
      ]
    },
    {
      move: {
        from: { x: 8, y: 9 },
        to: { x: 7, y: 7 },
        color: 0,
        piece: 'KE'
      },
      forks: [
        [
          {
            move: {
              from: { x: 8, y: 8 },
              to: { x: 2, y: 2 },
              color: 0,
              piece: 'KA',
              capture: 'KA',
              promote: false
            }
          },
          {
            move: {
              from: { x: 3, y: 1 },
              to: { x: 2, y: 2 },
              color: 1,
              piece: 'GI',
              capture: 'KA',
              same: true
            }
          },
          {
            move: { to: { x: 4, y: 5 }, color: 0, piece: 'KA' },
            forks: [
              [
                {
                  move: {
                    from: { x: 2, y: 7 },
                    to: { x: 2, y: 6 },
                    color: 0,
                    piece: 'FU'
                  }
                },
                {
                  move: {
                    from: { x: 9, y: 3 },
                    to: { x: 9, y: 4 },
                    color: 1,
                    piece: 'FU'
                  },
                  forks: [
                    [
                      {
                        move: {
                          from: { x: 1, y: 3 },
                          to: { x: 1, y: 4 },
                          color: 1,
                          piece: 'FU'
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          },
          {
            move: {
              from: { x: 9, y: 3 },
              to: { x: 9, y: 4 },
              color: 1,
              piece: 'FU'
            }
          }
        ]
      ]
    },
    {
      move: {
        from: { x: 2, y: 2 },
        to: { x: 7, y: 7 },
        color: 1,
        piece: 'KA',
        capture: 'KE',
        promote: true,
        same: true
      }
    },
    {
      move: {
        from: { x: 8, y: 8 },
        to: { x: 7, y: 7 },
        color: 0,
        piece: 'KA',
        capture: 'UM',
        same: true
      }
    },
    { move: { to: { x: 3, y: 3 }, color: 1, piece: 'KE', relative: 'H' } }
  ]
}

const hirateBoard = _.cloneDeep(KomaInfo.initBoards[BOARD.HIRATE])
const jkfLoadManager = new ShogiManager(jkfData)
const readOnlyLoadManger = new ShogiManager(jkfData, true)
const newManager = new ShogiManager()

const spyLog = jest.spyOn(console, 'error')
spyLog.mockImplementation(x => x)

/**
 * Shogi-manager test
 */
describe('Shogi-manger test', () => {
  let testManager: ShogiManager

  it('jkfLoadManagerが正常に初期化されている', () => {
    testManager = jkfLoadManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
  })

  it('readOnlyLoadMangerが正常に初期化されている', () => {
    testManager = readOnlyLoadManger
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
  })

  it('newMangerが正常に初期化されている', () => {
    testManager = newManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(null)
  })

  it('指し手の追加', () => {
    testManager = newManager
    testManager.addBoardMove(7, 7, 7, 6)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual({
      to: { x: 7, y: 6 },
      color: 0,
      piece: 'FU',
      from: { x: 7, y: 7 }
    })

    testManager.addBoardMove(3, 3, 3, 4)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual({
      to: { x: 3, y: 4 },
      color: 1,
      piece: 'FU',
      from: { x: 3, y: 3 }
    })

    testManager.addBoardMove(7, 6, 7, 5)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual({
      to: { x: 7, y: 5 },
      color: 0,
      piece: 'FU',
      from: { x: 7, y: 6 }
    })
    console.log(testManager.dispCurrentInfo())

    testManager.addBoardMove(2, 2, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual({
      to: { x: 8, y: 8 },
      color: 1,
      piece: 'KA',
      capture: 'KA',
      from: { x: 2, y: 2 }
    })

    testManager.currentNum--
    console.log(testManager.dispNextMoves())
  })

  it('分岐指し手の追加', () => {
    testManager = jkfLoadManager
    testManager.currentNum++
    console.log(testManager.dispNextMoves())
    testManager.addBoardMove(8, 3, 8, 4)
    console.log(testManager.dispNextMoves())
    console.log(testManager.dispCurrentInfo())
    console.log(testManager.dispKifuMoves())
  })

  it('指し手の分岐切り替え', () => {
    testManager = jkfLoadManager
    testManager.switchFork(1)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual({
      to: { x: 8, y: 4 },
      color: 1,
      piece: 'FU',
      from: { x: 8, y: 3 }
    })
    console.log(testManager.dispKifuMoves())
  })

  it('コメントの追加', () => {
    testManager = newManager
    expect(testManager.comment).toEqual(null)
    testManager.addComment('テストコメント1')
    expect(testManager.comment).toEqual(['テストコメント1'])
    testManager.addComment('テストコメント2')
    expect(testManager.comment).toEqual(['テストコメント1', 'テストコメント2'])
    testManager.go(0)
    expect(testManager.comment).toEqual(null)
    testManager.go(4)
    console.log(testManager.dispCurrentInfo())
  })

  it('同のつく指し手の追加', () => {
    testManager = newManager
    testManager.addBoardMove(7, 9, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual({
      to: { x: 8, y: 8 },
      color: 0,
      piece: 'GI',
      same: true,
      capture: 'KA',
      from: { x: 7, y: 9 }
    })
    console.log(testManager.dispCurrentInfo())
  })

  it('持ち駒からの指し手追加', () => {
    testManager = newManager
    testManager.addHandMove('KA', 5, 5)
    testManager.currentNum++
    expect(testManager.board).toEqual([
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        {},
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, { color: 1, kind: 'FU' }, {}, {}],
      [
        {},
        {},
        { color: 0, kind: 'FU' },
        {},
        { color: 1, kind: 'KA' },
        {},
        {},
        {},
        {}
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        {},
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [
        {},
        { color: 0, kind: 'GI' },
        {},
        {},
        {},
        {},
        {},
        { color: 0, kind: 'HI' },
        {}
      ],
      [
        { color: 0, kind: 'KY' },
        { color: 0, kind: 'KE' },
        {},
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ])
    console.log(testManager.dispCurrentInfo())
  })

  it('持ち駒からにない駒による指し手追加', () => {
    testManager = newManager
    testManager.addHandMove('KE', 5, 8)
    console.log(testManager.dispCurrentInfo())
    expect(console.error).toBeCalled()
    expect(spyLog.mock.calls[0][0]).toEqual(
      '打つ駒が手持ち駒の中にありません。'
    )
  })
})
