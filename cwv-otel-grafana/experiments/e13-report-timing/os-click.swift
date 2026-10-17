// macOS HID 이벤트 탭에 마우스 이벤트를 넣는다. 물리 마우스와 같은 경로(WindowServer → 앱)로 브라우저에 들어간다.
// click 은 그 좌표의 맨 위 창이 지정한 pid 의 것일 때만 누른다. 아니면 누르지 않고 종료 코드 2.
// 사용: os-click click X Y PID | os-click move X Y PID | os-click warp X Y | os-click where
import CoreGraphics
import Foundation

let a = CommandLine.arguments

func owner(_ p: CGPoint) -> Int? {
  let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as! [[String: Any]]
  for w in list where (w[kCGWindowLayer as String] as? Int) == 0 {
    guard let b = w[kCGWindowBounds as String] as? NSDictionary, let r = CGRect(dictionaryRepresentation: b) else { continue }
    if r.contains(p) { return w[kCGWindowOwnerPID as String] as? Int }
  }
  return nil
}

func post(_ type: CGEventType, _ p: CGPoint) {
  let e = CGEvent(mouseEventSource: CGEventSource(stateID: .hidSystemState), mouseType: type, mouseCursorPosition: p, mouseButton: .left)!
  if type != .mouseMoved { e.setIntegerValueField(.mouseEventClickState, value: 1) }
  e.post(tap: .cghidEventTap)
}

switch a[1] {
case "click":
  let p = CGPoint(x: Double(a[2])!, y: Double(a[3])!)
  guard owner(p) == Int(a[4])! else { print("owner", owner(p) ?? -1); exit(2) }
  post(.mouseMoved, p); usleep(300_000)
  post(.leftMouseDown, p); usleep(80_000)
  post(.leftMouseUp, p)
case "move":
  let p = CGPoint(x: Double(a[2])!, y: Double(a[3])!)
  guard owner(p) == Int(a[4])! else { print("owner", owner(p) ?? -1); exit(2) }
  post(.mouseMoved, p)
case "warp":
  CGWarpMouseCursorPosition(CGPoint(x: Double(a[2])!, y: Double(a[3])!))
case "where":
  let p = CGEvent(source: nil)!.location
  print(p.x, p.y)
default:
  exit(1)
}
